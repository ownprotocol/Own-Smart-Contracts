// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/extensions/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ISablierLockup} from "@sablier/lockup/src/interfaces/ISablierLockup.sol";

import "../interfaces/IStake.sol";
import "../interfaces/IveOwn.sol";

import "hardhat/console.sol";

contract Stake is
    IStake,
    AccessControlEnumerableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using SafeERC20 for IERC20;

    IERC20 public ownToken;
    IveOWN public veOWN;
    ISablierLockup public sablierLockup;

    uint256 sablierStreamId;

    uint256 public constant WEEK = 7 days;

    // NOTE: Do constants get inlined when optimized?
    uint256 public maximumLockDays;
    uint256 public minimumLockDays;

    uint256 public dailyRewardAmount;

    uint256 public stakingStartDay;

    struct RewardValuesWeeklyCache {
        // This value is used to calculate the reward per token for the week when claiming rewards
        uint256 weeklyRewardPerTokenCached;
        // All these values are used in recalculation of subsequent weeks
        uint256 validVeOwnAtEndOfWeek;
        uint256 boostMultiplierAtEndOfWeek;
        uint256 dailyRewardAmountAtEndOfWeek;
    }

    uint256 public totalPositions;
    mapping(uint256 => StakePosition) public positions;
    mapping(address => uint256[]) public usersPositions;
    mapping(uint256 => uint256) public validVeOwnAdditionsInDay;
    mapping(uint256 => uint256) public validVeOwnSubtractionsInDay;

    mapping(uint256 => uint256) public dailyRewardValueHistory;
    mapping(uint256 => uint256) public boostMultiplierHistory;
    mapping(uint256 => RewardValuesWeeklyCache) public rewardValuesWeeklyCache;

    uint256 public lastCachedWeek;

    modifier onlyDefaultAdmin() {
        // TODO: Add custom error
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Caller is not the default admin"
        );
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        IERC20 _ownToken,
        IveOWN _veOWN,
        ISablierLockup _sablierLockup
    ) public initializer {
        __AccessControlEnumerable_init();
        __ReentrancyGuard_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        ownToken = _ownToken;
        veOWN = _veOWN;
        sablierLockup = _sablierLockup;

        maximumLockDays = 364;
        minimumLockDays = 7;

        // MAX_LOCK_WEEKS = 52;
        // MIN_LOCK_WEEKS = 1;
    }

    function stake(uint256 _amount, uint256 _days) external nonReentrant {
        if (_days < minimumLockDays || _days > maximumLockDays) {
            revert InvalidLockPeriod();
        }
        if (_amount == 0) {
            revert CannotStakeZeroAmount();
        }

        if (!hasStakingStarted()) {
            revert StakingNotStarted();
        }

        _updateWeeklyRewardValuesCache();

        // NOTE: There is no maximum multiplier here
        uint256 veOwnAmount = _amount * (_days / 7);

        uint256 currentDay = getCurrentDay();
        // They will start earning rewards from the next day
        uint256 startDay = currentDay + 1;
        // Inclusive of the last day
        uint256 finalDay = startDay + _days;
        uint256 positionId = totalPositions;

        // record their position
        positions[positionId] = StakePosition({
            owner: msg.sender,
            ownAmount: _amount,
            veOwnAmount: veOwnAmount,
            startDay: startDay,
            // Rewards are inclusive of the last day
            finalDay: finalDay,
            lastDayRewardsClaimed: currentDay
        });
        usersPositions[msg.sender].push(positionId);

        validVeOwnAdditionsInDay[startDay] += veOwnAmount;
        validVeOwnSubtractionsInDay[finalDay + 1] += veOwnAmount;

        totalPositions = positionId + 1;

        ownToken.safeTransferFrom(msg.sender, address(this), _amount);
        veOWN.mint(msg.sender, veOwnAmount);

        emit Staked(msg.sender, startDay, finalDay, positionId, _amount, _days);
    }

    function positionsWithClaimableRewards(
        address _user
    )
        external
        view
        returns (
            uint256[] memory allUserPositions,
            uint256[] memory claimableRewards,
            uint256 totalRewards
        )
    {
        allUserPositions = usersPositions[_user];

        for (uint256 i = 0; i < allUserPositions.length; i++) {
            // TODO: Assumes weeks have been processed
            claimableRewards[i] = _calculateRewardsForPosition(
                allUserPositions[i],
                getCurrentDay()
            );
            totalRewards += claimableRewards[i];
        }
    }

    function claimRewards(
        uint256[] calldata positionIds
    ) external nonReentrant {
        _updateWeeklyRewardValuesCache();

        uint256 currentDay = getCurrentDay();
        uint256 reward;

        for (uint256 i = 0; i < positionIds.length; i++) {
            StakePosition storage position = positions[i];

            if (msg.sender != position.owner) {
                revert("Not the owner of the position");
            }

            if (position.lastDayRewardsClaimed == currentDay - 1) {
                revert("No rewards to claim");
            }
            console.log("Claiming rewards for position %s", positionIds[i]);

            reward += _calculateRewardsForPosition(positionIds[i], currentDay);

            // TODO: This needs to be set to the first day of the previous week
            // Because they can only claim full weeks at a time
            position.lastDayRewardsClaimed = currentDay - 1;
        }

        uint256 balance = ownToken.balanceOf(address(this));

        if (balance < reward) {
            uint256 withdrawableAmount = sablierLockup.withdrawableAmountOf(
                sablierStreamId
            );

            if (balance + withdrawableAmount < reward) {
                revert("Unrecoverable error");
            }

            sablierLockup.withdrawMax(sablierStreamId, address(this));
        }

        ownToken.safeTransfer(msg.sender, reward);

        // TODO: If the stake is complete, transfer them their Own tokens

        // TODO: Emit
    }

    // **** Read functions ****

    function getTotalStake(address _user) external view returns (uint256) {
        uint256[] memory userPositionCount = usersPositions[_user];

        uint256 totalStaked;

        for (uint256 i = 0; i < userPositionCount.length; i++) {
            totalStaked += positions[userPositionCount[i]].ownAmount;
        }

        return totalStaked;
    }

    function getBoostMultiplier(uint256 week) public view returns (uint256) {
        uint256 weeksSinceStart = week - stakingStartDay;

        if (weeksSinceStart == 1) return 10;
        if (weeksSinceStart <= 4) return 5;
        if (weeksSinceStart <= 12) return 3;

        return 1;
    }

    function getPreviousWeekReturns() external returns (uint256) {
        // ISSUE: We need a view function that runs the _updateVeOwnPerWeekCache function in case there are missing weeks in the calculation
        uint256 currentWeek = getCurrentDay();

        uint256 reward;

        // for (uint256 i = 0; i < totalPositions; i++) {
        //     StakePosition storage position = positions[i];
        //
        //     if (position. == currentWeek - 1) {
        //         continue;
        //     }
        //
        //     _updateVeOwnPerWeekCache();
        //
        //     for (
        //         uint256 week = position.startWeek;
        //         week < currentWeek;
        //         ++week
        //     ) {
        //         reward +=
        //             (position.veOwnAmount * weeklyRewardPerTokenCached[week]) /
        //             1e18;
        //     }
        // }

        return reward;
    }

    // Because in this contract weeks start from Saturday 00:00:00 UTC
    // We need to ensure that getCurrentDay starts from the first Saturday 1970
    function getCurrentDay() public view returns (uint256) {
        return (block.timestamp + 2 days) / 1 days;
    }

    function getUsersPositions(
        address _user
    ) external view returns (StakePosition[] memory userPositions) {
        uint256[] memory userPositionIds = usersPositions[_user];

        userPositions = new StakePosition[](userPositionIds.length);

        for (uint256 i = 0; i < userPositionIds.length; i++) {
            userPositions[i] = positions[userPositionIds[i]];
        }
    }

    function hasStakingStarted() internal view returns (bool) {
        return stakingStartDay != 0;
    }

    // **** Admin functions ****

    function setSablierStreamId(uint256 _streamId) external onlyDefaultAdmin {
        sablierStreamId = _streamId;

        // TODO: EVENT
    }

    function startStaking() external onlyDefaultAdmin {
        if (dailyRewardAmount == 0) {
            revert("Daily reward amount not set");
        }
        // TODO: Revert if staking already started
        uint256 currentDay = getCurrentDay();

        stakingStartDay = currentDay;

        uint256 previousWeek = currentDay / 7 - 1;
        lastCachedWeek = previousWeek;

        uint256 dailyRewardAmountCached = dailyRewardAmount;
        uint256 weeklyRewardPerToken = _calculateRewardPerToken(
            dailyRewardAmountCached,
            getBoostMultiplier(currentDay),
            1 ether
        );
        console.log("Weekly reward per token: %s", weeklyRewardPerToken);

        rewardValuesWeeklyCache[previousWeek] = RewardValuesWeeklyCache({
            weeklyRewardPerTokenCached: weeklyRewardPerToken,
            validVeOwnAtEndOfWeek: 0,
            boostMultiplierAtEndOfWeek: getBoostMultiplier(currentDay),
            dailyRewardAmountAtEndOfWeek: dailyRewardAmountCached
        });

        // TODO: Save to cache
    }

    function setDailyRewardAmount(uint256 _amount) external onlyDefaultAdmin {
        if (hasStakingStarted()) {
            // Re-sync the cache, as we need to ensure that the previous weeklyRewardAmount is carried into the cache
            _updateWeeklyRewardValuesCache();
        }

        // TODO: Need to validate the amount value here
        dailyRewardValueHistory[getCurrentDay()] = _amount;
        dailyRewardAmount = _amount;

        // TODO: Emit event
    }

    function _calculateRewardPerToken(
        uint256 _dailyRewardAmount,
        uint256 _boostMultiplier,
        uint256 _validVeOwn
    ) internal pure returns (uint256) {
        // TODO: This needs to handle 1e18
        return (_dailyRewardAmount * _boostMultiplier) / _validVeOwn;
    }

    // **** Internal functions ****

    function _updateWeeklyRewardValuesCache() internal {
        // TODO: Have this fetch the current week
        uint256 currentWeek = block.timestamp / 7 days;
        console.log(block.timestamp);
        console.log("Current week: %s", currentWeek);

        // Run through all weeks from the last cached week to the current week
        for (uint256 week = lastCachedWeek + 1; week < currentWeek; ++week) {
            // Start with the previous week and add the following week to account for new stakes
            uint256 currentVeOwnTotal = rewardValuesWeeklyCache[week - 1]
                .validVeOwnAtEndOfWeek;

            uint256 rewardPerTokenInWeek;

            uint256 dailyRewardAmountCurrent = rewardValuesWeeklyCache[week - 1]
                .dailyRewardAmountAtEndOfWeek;

            uint256 boostMultiplier = rewardValuesWeeklyCache[week - 1]
                .boostMultiplierAtEndOfWeek;

            // Iterate over each day and calculate the reward per token for that day
            // Add it to the cumulative reward per token for the week
            for (uint256 day; day < 7; ++day) {
                uint256 currentDay = week * 7 + day;

                currentVeOwnTotal += validVeOwnAdditionsInDay[currentDay];
                currentVeOwnTotal -= validVeOwnSubtractionsInDay[currentDay];

                // If the admin changed the daily reward amount or boost multiplier for the day, we need to update the cache
                uint256 dailyRewardAmountUpdate = dailyRewardValueHistory[
                    currentDay
                ];
                uint256 boostMultiplierUpdate = boostMultiplierHistory[
                    currentDay
                ];
                if (boostMultiplierUpdate != 0) {
                    boostMultiplier = boostMultiplierUpdate;
                }
                if (dailyRewardAmount != 0) {
                    dailyRewardAmountCurrent = dailyRewardAmountUpdate;
                }

                rewardPerTokenInWeek += _calculateRewardPerToken(
                    dailyRewardAmountCurrent,
                    boostMultiplier,
                    currentVeOwnTotal
                );
            }

            rewardValuesWeeklyCache[week] = RewardValuesWeeklyCache({
                weeklyRewardPerTokenCached: rewardPerTokenInWeek,
                validVeOwnAtEndOfWeek: currentVeOwnTotal,
                boostMultiplierAtEndOfWeek: getBoostMultiplier(week),
                dailyRewardAmountAtEndOfWeek: dailyRewardAmount
            });
        }

        lastCachedWeek = currentWeek - 1;
        // TODO: Update event
    }

    // claimRewards

    function _rewardPerTokenForDayRange(
        uint256 _startDay,
        uint256 _endDay
    ) internal view returns (uint256 rewardPerToken) {
        uint256 previousWeek = _startDay / 7 - 1;
        // Start with the previous week value
        uint256 validVeOwn = rewardValuesWeeklyCache[previousWeek]
            .validVeOwnAtEndOfWeek;
        uint256 dailyRewardAmountCurrent = rewardValuesWeeklyCache[previousWeek]
            .dailyRewardAmountAtEndOfWeek;
        uint256 boostMultiplierCurrent = rewardValuesWeeklyCache[previousWeek]
            .boostMultiplierAtEndOfWeek;

        for (
            // This starts off with the first day of the week
            uint256 currentDay = _startDay - (_startDay % 7);
            currentDay < _endDay;
            ++currentDay
        ) {
            validVeOwn += validVeOwnAdditionsInDay[currentDay];
            validVeOwn -= validVeOwnSubtractionsInDay[currentDay];

            uint256 boostMultiplierUpdate = boostMultiplierHistory[currentDay];
            if (boostMultiplierUpdate != 0) {
                boostMultiplierCurrent = boostMultiplierUpdate;
            }

            uint256 dailyRewardAmountUpdate = dailyRewardValueHistory[
                currentDay
            ];
            if (dailyRewardAmountUpdate != 0) {
                dailyRewardAmountCurrent = dailyRewardAmountUpdate;
            }

            rewardPerToken = _calculateRewardPerToken(
                dailyRewardAmountCurrent,
                boostMultiplierCurrent,
                validVeOwn
            );
        }
    }

    // TODO: Pass through the weeklyRewardPerTokenCached
    // The validVeOwnAtEndOfWeek and boostMultiplierAtEndOfWeek are used to calculate the reward per token for the week
    // Unfortunately this assumes that the previous week has been processed. WHICH is a same assumption in the claimRewards function because we always process beforehand
    // BUT the view methods won't work then, so we need to support them ......
    function _calculateRewardsForPosition(
        uint256 _positionId,
        uint256 _currentDay
    ) internal view returns (uint256 reward) {
        StakePosition storage position = positions[_positionId];

        uint256 currentWeek = _currentDay / 7;

        if (position.lastDayRewardsClaimed == _currentDay - 1) {
            return 0;
        }

        // TODO: THis needs to account for the fact that users can claim at any point after a week.

        console.log("Calculating rewards for position %s", _positionId);
        uint256 startWeek = position.startDay / 7;
        uint256 claimRewardsUpToDay = position.finalDay > _currentDay
            ? _currentDay - 1
            : position.finalDay;
        console.log("Claim rewards up to day: %s", claimRewardsUpToDay);
        console.log("Current day: %s", _currentDay);

        console.log("Position start day: %s", position.startDay);
        uint256 lastDayOfFirstWeek = startWeek * 7 + 6;
        console.log("Last day of first week: %s", lastDayOfFirstWeek);

        // Can only claim the first week of rewards once the week finishes AND
        // they have not claimed rewards for the first week
        if (
            _currentDay > lastDayOfFirstWeek &&
            position.lastDayRewardsClaimed < lastDayOfFirstWeek
        ) {
            uint256 finalDayOfRewardsForWeek = claimRewardsUpToDay <
                lastDayOfFirstWeek
                ? claimRewardsUpToDay
                : lastDayOfFirstWeek;

            console.log("1");
            uint256 firstWeekRewardPerToken = _rewardPerTokenForDayRange(
                position.lastDayRewardsClaimed + 1,
                finalDayOfRewardsForWeek
            );
            console.log("2");

            reward += (position.veOwnAmount * firstWeekRewardPerToken) / 1e18;
        }

        uint256 lastWeekClaimed = position.lastDayRewardsClaimed / 7;

        uint256 finalWeek = position.finalDay / 7;

        // Iterate over every week, using the cached value for efficiency
        for (
            uint256 week = lastWeekClaimed + 1;
            week < currentWeek - 1;
            ++week
        ) {
            console.log("3");
            reward +=
                (position.veOwnAmount *
                    rewardValuesWeeklyCache[week].weeklyRewardPerTokenCached) /
                1e18;
            console.log("4");
        }

        // Add rewards for the last week they stake for
        uint256 firstDayOfFinalWeek = finalWeek * 7;
        if (claimRewardsUpToDay >= firstDayOfFinalWeek) {
            uint256 firstDayOfRewardsForWeek = position.lastDayRewardsClaimed >
                firstDayOfFinalWeek
                ? position.lastDayRewardsClaimed + 1
                : firstDayOfFinalWeek;

            uint256 lastWeekRewardPerToken = _rewardPerTokenForDayRange(
                firstDayOfRewardsForWeek,
                claimRewardsUpToDay
            );

            reward += (position.veOwnAmount * lastWeekRewardPerToken) / 1e18;
        }
    }

    // TODO: Ordered array
    struct BoostDetails {
        uint256 durationInDays;
        uint256 startDay;
        uint256 multiplier;
    }
    BoostDetails[] public boostDetails;

    function addBoostDetails(
        uint256 _startTime,
        uint256 _durationInDays,
        uint256 _multiplier
    ) external onlyDefaultAdmin {
        uint256 startDay = _startTime / 1 days;
        uint256 currentDay = getCurrentDay();

        if (startDay <= currentDay) {
            revert("Cannot add boost for past or current day");
        }

        for (uint256 i = 0; i < boostDetails.length; i++) {
            if (boostDetails[i].startDay == startDay) {
                revert("Boost already exists for this day");
            }

            // Inclusive of the last day
            uint256 currentBoostEndDay = boostDetails[i].startDay +
                boostDetails[i].durationInDays;

            if (
                boostDetails[1].startDay <= startDay &&
                currentBoostEndDay >= startDay
            ) {
                revert("Boost overlaps with existing boost");
            }
        }

        boostDetails.push(
            BoostDetails({
                durationInDays: _durationInDays,
                multiplier: _multiplier,
                startDay: startDay
            })
        );

        // TODO: ENsure this is updated if we create a method to change the start day of a boost period
        dailyRewardValueHistory[startDay] = _multiplier;
    }
}
