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
    uint256 public maximumLockWeeks;
    uint256 public minimumLockWeeks;

    uint256 public dailyRewardAmount;

    uint256 public totalPositions;

    uint256 public stakingStartWeek;

    struct RewardValuesWeeklyCache {
        // This value is used to calculate the reward per token for the week when claiming rewards
        uint256 weeklyRewardPerTokenCached;
        // All these values are used in recalculation of subsequent weeks
        uint256 validVeOwnAtEndOfWeek;
        uint256 boostMultiplierAtEndOfWeek;
        uint256 dailyRewardAmountAtEndOfWeek;
    }

    mapping(uint256 => StakePosition) public positions;
    mapping(address => uint256[]) public usersPositions;
    mapping(uint256 => uint256) public validVeOwnAdditionsInDay;
    mapping(uint256 => uint256) public validVeOwnSubtractionsInDay;

    mapping(uint256 => uint256) public dailyRewardValueHistory;
    mapping(uint256 => uint256) public boostMultiplierHistory;
    mapping(uint256 => RewardValuesWeeklyCache) public rewardValuesWeeklyCache;

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
    ) external onlyOwner {
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

    uint256 public lastCachedWeek;

    modifier onlyOwner() {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Caller is not the owner"
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

        ownToken = _ownToken;
        veOWN = _veOWN;
        sablierLockup = _sablierLockup;

        uint256 currentWeek = getCurrentDay();

        lastCachedWeek = currentWeek;

        maximumLockWeeks = 52;
        minimumLockWeeks = 1;

        // MAX_LOCK_WEEKS = 52;
        // MIN_LOCK_WEEKS = 1;
    }

    function stake(uint256 _amount, uint256 _days) external nonReentrant {
        if (_days < minimumLockWeeks || _days > maximumLockWeeks) {
            revert InvalidLockPeriod();
        }
        if (_amount == 0) {
            revert CannotStakeZeroAmount();
        }

        if (!hasStakingStarted()) {
            revert StakingNotStarted();
        }

        _updateVeOwnPerWeekCache();

        // NOTE: There is no maximum multiplier here
        uint256 veOwnAmount = _amount * _days;

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

        uint256 positionExpiryWeek = finalDay / 7 days;

        validVeOwnAdditionsInDay[startDay] += veOwnAmount;
        validVeOwnSubtractionsInDay[finalDay + 1] += veOwnAmount;

        totalPositions = positionId + 1;

        ownToken.safeTransferFrom(msg.sender, address(this), _amount);
        veOWN.mint(msg.sender, veOwnAmount);

        emit Staked(msg.sender, startDay, finalDay, positionId, _amount, _days);
    }

    // function positionsWithClaimableRewards(
    //     address _user
    // )
    //     external
    //     view
    //     returns (
    //         uint256[] memory allUserPositions,
    //         uint256[] memory claimableRewards,
    //         uint256 totalRewards
    //     )
    // {
    //     allUserPositions = usersPositions[_user];
    //
    //     (claimableRewards, totalRewards) = _calculateClaimableRewards(
    //         allUserPositions,
    //         false
    //     );
    // }

    // function _calculateClaimableRewards(
    //     uint256[] memory positionIds,
    //     bool _revertOnNoRewards
    // )
    //     internal
    //     view
    //     returns (uint256[] memory rewardsPerPosition, uint256 totalRewards)
    // {
    //     uint256 currentWeek = getCurrentDay();
    //
    //     rewardsPerPosition = new uint256[](positionIds.length);
    //
    //     for (uint256 i = 0; i < positionIds.length; i++) {
    //         StakePosition storage position = positions[i];
    //
    //         if (msg.sender != position.owner) {
    //             revert("Not the owner of the position");
    //         }
    //
    //         if (position.lastDayRewardsClaimed == currentWeek - 1) {
    //             if (_revertOnNoRewards) {
    //                 revert("No rewards to claim");
    //             } else {
    //                 continue;
    //             }
    //         }
    //
    //         for (uint256 week = position.startDay; week < currentWeek; ++week) {
    //             rewardsPerPosition[i] +=
    //                 (position.veOwnAmount * weeklyRewardPerTokenCached[week]) /
    //                 1e18;
    //         }
    //
    //         totalRewards += rewardsPerPosition[i];
    //     }
    //
    //     return (rewardsPerPosition, totalRewards);
    // }

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
        uint256 boostMultiplier = rewardValuesWeeklyCache[previousWeek]
            .boostMultiplierAtEndOfWeek;

        for (
            // This starts off with the first day of the week
            uint256 currentDay = _startDay - (_startDay % 7);
            currentDay < _endDay;
            ++currentDay
        ) {
            validVeOwn += validVeOwnAdditionsInDay[currentDay];
            validVeOwn -= validVeOwnSubtractionsInDay[currentDay];

            rewardPerToken +=
                (dailyRewardAmountCurrent * boostMultiplier) /
                validVeOwn;
        }
    }

    function claimRewards(
        uint256[] calldata positionIds
    ) external nonReentrant {
        _updateVeOwnPerWeekCache();

        uint256 reward;

        for (uint256 i = 0; i < positionIds.length; i++) {
            StakePosition storage position = positions[i];

            if (msg.sender != position.owner) {
                revert("Not the owner of the position");
            }

            uint256 currentDay = getCurrentDay();
            if (position.lastDayRewardsClaimed == currentDay - 1) {
                revert("No rewards to claim");
            }

            uint256 startWeek = position.startDay / 7;
            uint256 claimRewardsUpToDay = position.finalDay > currentDay
                ? currentDay - 1
                : position.finalDay;

            uint256 endWeek = claimRewardsUpToDay / 7;

            for (
                uint256 week = startWeek + 1;
                week < claimRewardsUpToDay / 7;
                ++week
            ) {
                reward +=
                    (position.veOwnAmount *
                        rewardValuesWeeklyCache[week]
                            .weeklyRewardPerTokenCached) /
                    1e18;
            }
            // TODO: This gets more complex when you consider that the user may have already claimed rewards for the first and last week
            uint256 firstWeekRewardPerToken = _rewardPerTokenForDayRange(
                position.startDay,
                startWeek * 7
            );
            uint256 lastWeekRewardPerToken = _rewardPerTokenForDayRange(
                position.finalDay,
                position.finalDay - (position.finalDay % 7)
            );

            reward += (position.veOwnAmount * firstWeekRewardPerToken) / 1e18;
            reward += (position.veOwnAmount * lastWeekRewardPerToken) / 1e18;

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
        uint256 weeksSinceStart = week - stakingStartWeek;

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

    function getCurrentDay() public view returns (uint256) {
        return block.timestamp / 1 days;
    }

    function hasStakingStarted() internal view returns (bool) {
        return stakingStartWeek != 0;
    }

    // **** Admin functions ****

    function setSablierStreamId(uint256 _streamId) external onlyOwner {
        sablierStreamId = _streamId;

        // TODO: EVENT
    }

    function startStaking() external onlyOwner {
        stakingStartWeek = getCurrentDay();

        // TODO: Save to cache
    }

    function setWeeklyRewardAmount(uint256 _amount) external onlyOwner {
        // Re-sync the cache, as we need to ensure that the previous weeklyRewardAmount is carried into the cache
        _updateVeOwnPerWeekCache();

        // TODO: Need to validate the amount value here
        dailyRewardValueHistory[getCurrentDay()] = _amount;

        // TODO: Emit event
    }

    // **** Internal functions ****

    // TODO: add bool argument for whether to update the cache
    function _updateVeOwnPerWeekCache() internal {
        uint256 currentWeek = block.timestamp / 7 days;

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

                rewardPerTokenInWeek +=
                    (dailyRewardAmount * getBoostMultiplier(currentDay)) /
                    currentVeOwnTotal;
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
}
