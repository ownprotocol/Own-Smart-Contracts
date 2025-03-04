// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/access/extensions/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "../interfaces/IStake.sol";
import "../interfaces/IveOwn.sol";
import "../interfaces/IOwn.sol";
import "../interfaces/ISablierLockup.sol";

import "hardhat/console.sol";

contract Stake is
    IStake,
    AccessControlEnumerableUpgradeable,
    ReentrancyGuardUpgradeable
{
    using SafeERC20 for IOwn;

    IOwn public ownToken;
    IveOWN public veOWN;
    ISablierLockup public sablierLockup;

    uint256 sablierStreamId;

    uint256 public maximumLockDays;
    uint256 public minimumLockDays;

    uint256 public dailyRewardAmount;

    uint256 public stakingStartWeek;

    uint256 public totalStaked;

    uint256 public totalRewardsIssued;

    // Tracks all users who have staked at some point
    uint256 public totalUsers;

    struct RewardValuesWeeklyCache {
        // This value is used to calculate the reward per token for the week when claiming rewards
        uint256 weeklyRewardPerTokenCached;
        // All these values are used in recalculation of subsequent weeks
        uint256 validVeOwnAtEndOfWeek;
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
        IOwn _ownToken,
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

        uint256 totalWeeks = _days / 7;

        // NOTE: There is no maximum multiplier here
        uint256 veOwnAmount = _amount * totalWeeks;

        uint256 currentDay = getCurrentDay();
        uint256 currentWeek = getCurrentWeek();

        // They will start earning rewards from the next day
        uint256 startDay = currentDay + 1;

        // Inclusive of the final day so subtract 1
        uint256 finalDay = startDay + _days - 1;
        uint256 positionId = totalPositions;

        if (usersPositions[msg.sender].length == 0) {
            ++totalUsers;
        }

        // record their position
        positions[positionId] = StakePosition({
            owner: msg.sender,
            ownAmount: _amount,
            veOwnAmount: veOwnAmount,
            startDay: startDay,
            // Rewards are inclusive of the last day
            finalDay: finalDay,
            lastWeekRewardsClaimed: currentWeek,
            rewardsClaimed: 0
        });
        usersPositions[msg.sender].push(positionId);

        validVeOwnAdditionsInDay[startDay] += veOwnAmount;
        validVeOwnSubtractionsInDay[finalDay + 1] += veOwnAmount;

        totalStaked += _amount;

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
                allUserPositions[i]
            );
            totalRewards += claimableRewards[i];
        }
    }

    function claimRewards(
        uint256[] calldata positionIds
    ) external nonReentrant {
        _updateWeeklyRewardValuesCache();

        if (!hasStakingStarted()) {
            revert StakingNotStarted();
        }

        uint256 currentWeek = getCurrentWeek();

        uint256[] memory rewardPerPosition = new uint256[](positionIds.length);
        uint256 totalReward;

        for (uint256 i = 0; i < positionIds.length; i++) {
            StakePosition storage position = positions[positionIds[i]];

            if (msg.sender != position.owner) {
                revert CallerDoesNotOwnPosition();
            }

            if (currentWeek == position.lastWeekRewardsClaimed) {
                continue;
            }

            uint256 reward = _calculateRewardsForPosition(positionIds[i]);

            totalReward += reward;
            rewardPerPosition[i] = reward;
            position.rewardsClaimed += reward;

            uint256 finalWeek = position.finalDay / 7;
            if (currentWeek > finalWeek) {
                position.lastWeekRewardsClaimed = finalWeek;

                totalReward += position.ownAmount;
                totalStaked -= position.ownAmount;
            } else {
                position.lastWeekRewardsClaimed = currentWeek;
            }
        }

        if (totalReward == 0) {
            revert NoRewardsToClaim();
        }

        // Should be safe to deduct the total reward from the total staked amount because we never issue more than what is held by the contract
        uint256 remainingBalanceForRewards = ownToken.balanceOf(address(this)) -
            totalStaked;

        if (totalReward > remainingBalanceForRewards) {
            uint256 withdrawableAmount = sablierLockup.withdrawableAmountOf(
                sablierStreamId
            );

            if (remainingBalanceForRewards + withdrawableAmount < totalReward) {
                revert("Unrecoverable error");
            }

            sablierLockup.withdrawMax(sablierStreamId, address(this));
        }

        ownToken.safeTransfer(msg.sender, totalReward);

        totalRewardsIssued += totalReward;

        emit RewardsClaimed(
            msg.sender,
            positionIds,
            rewardPerPosition,
            totalReward
        );
    }

    // **** Read functions ****

    function getTotalStake(
        address _user
    ) external view returns (uint256 usersTotalStaked) {
        uint256[] memory userPositionCount = usersPositions[_user];

        for (uint256 i = 0; i < userPositionCount.length; i++) {
            uint256 finalWeekOfStaking = positions[userPositionCount[i]]
                .finalDay / 7;

            if (
                finalWeekOfStaking !=
                positions[userPositionCount[i]].lastWeekRewardsClaimed
            ) {
                usersTotalStaked += positions[userPositionCount[i]].ownAmount;
            }
        }
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
        return block.timestamp / 1 days - 2;
    }

    function getCurrentWeek() public view returns (uint256) {
        return getCurrentDay() / 7;
    }

    function getWeekSinceStakingStarted() public view returns (uint256) {
        if (stakingStartWeek == 0) {
            return 0;
        }

        uint256 currentWeek = getCurrentWeek();

        if (currentWeek < stakingStartWeek) {
            return 0;
        }

        return (currentWeek + 1) - stakingStartWeek;
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
        return stakingStartWeek != 0 && stakingStartWeek <= getCurrentWeek();
    }

    // **** Admin functions ****

    function setSablierStreamId(uint256 _streamId) external onlyDefaultAdmin {
        sablierStreamId = _streamId;

        // TODO: EVENT
    }

    function startStakingNextWeek() external onlyDefaultAdmin {
        if (dailyRewardAmount == 0) {
            revert("Daily reward amount not set");
        }

        if (stakingStartWeek != 0) {
            revert("Staking has already started");
        }

        uint256 currentWeek = getCurrentWeek();

        stakingStartWeek = currentWeek + 1;

        lastCachedWeek = currentWeek;

        rewardValuesWeeklyCache[currentWeek] = RewardValuesWeeklyCache({
            weeklyRewardPerTokenCached: 0,
            validVeOwnAtEndOfWeek: 0,
            dailyRewardAmountAtEndOfWeek: dailyRewardAmount
        });
    }

    function setDailyRewardAmount(uint256 _amount) external onlyDefaultAdmin {
        // TODO: How the heck would we check that this is within bounds
        if (hasStakingStarted()) {
            // Re-sync the cache, as we need to ensure that the previous weeklyRewardAmount is carried into the cache
            _updateWeeklyRewardValuesCache();
        }

        uint256 currentWeek = getCurrentWeek();

        // This side steps a pretty inconsenquential issue where the admin:
        // Sets the daily reward amount, calls startStakingNextWeek(), then sets the daily reward amount again BEFORE staking starts
        if (
            rewardValuesWeeklyCache[currentWeek].dailyRewardAmountAtEndOfWeek !=
            0
        ) {
            rewardValuesWeeklyCache[currentWeek]
                .dailyRewardAmountAtEndOfWeek = _amount;
        }

        // TODO: Need to validate the amount value here
        dailyRewardValueHistory[getCurrentDay()] = _amount;
        dailyRewardAmount = _amount;

        // TODO: Emit event
    }

    // **** Internal functions ****

    function _calculateRewardPerToken(
        uint256 _dailyRewardAmount,
        uint256 _boostMultiplier,
        uint256 _validVeOwn
    ) internal pure returns (uint256) {
        // Everything is scaled by 1e18 so we don't need to divide by 1e18 at the end
        return (_dailyRewardAmount * _boostMultiplier) / _validVeOwn;
    }

    function _updateWeeklyRewardValuesCache() internal {
        uint256 currentWeek = getCurrentWeek();
        if (lastCachedWeek == currentWeek - 1) {
            return;
        }

        // Run through all weeks from the last cached week to the current week
        for (uint256 week = lastCachedWeek + 1; week < currentWeek; ++week) {
            // Start with the previous week and add the following week to account for new stakes
            uint256 currentVeOwnTotal = rewardValuesWeeklyCache[week - 1]
                .validVeOwnAtEndOfWeek;

            uint256 dailyRewardAmountCurrent = rewardValuesWeeklyCache[week - 1]
                .dailyRewardAmountAtEndOfWeek;

            uint256 boostMultiplier = getBoostMultiplierForWeek(week);

            uint256 rewardPerTokenInWeek;

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
                console.log("Iterating over day: %s", currentDay);

                if (dailyRewardAmountUpdate != 0) {
                    console.log(
                        ">>>>Updating daily reward amount for day: %s",
                        currentDay
                    );
                    dailyRewardAmountCurrent = dailyRewardAmountUpdate;
                }

                if (currentVeOwnTotal == 0) {
                    continue;
                }

                rewardPerTokenInWeek += _calculateRewardPerToken(
                    dailyRewardAmountCurrent,
                    boostMultiplier,
                    currentVeOwnTotal
                );
            }
            // console.log("Reward per token in week: %s", rewardPerTokenInWeek);
            // console.log("Current veOwn total: %s", currentVeOwnTotal);
            // console.log("Boost multiplier: %s", boostMultiplier);

            rewardValuesWeeklyCache[week] = RewardValuesWeeklyCache({
                weeklyRewardPerTokenCached: rewardPerTokenInWeek,
                validVeOwnAtEndOfWeek: currentVeOwnTotal,
                dailyRewardAmountAtEndOfWeek: dailyRewardAmountCurrent
            });
        }

        lastCachedWeek = currentWeek - 1;
    }

    // claimRewards

    function _rewardPerTokenForDayRange(
        uint256 _startDay,
        uint256 _finalDay
    ) internal view returns (uint256 rewardPerToken) {
        uint256 previousWeek = _startDay / 7 - 1;
        // Start with the previous week value
        uint256 validVeOwn = rewardValuesWeeklyCache[previousWeek]
            .validVeOwnAtEndOfWeek;
        uint256 dailyRewardAmountCurrent = rewardValuesWeeklyCache[previousWeek]
            .dailyRewardAmountAtEndOfWeek;

        uint256 boostMultiplier = getBoostMultiplierForWeek(previousWeek + 1);

        for (
            // This starts off with the first day of the week
            uint256 currentDay = _startDay - (_startDay % 7);
            currentDay <= _finalDay;
            ++currentDay
        ) {
            validVeOwn += validVeOwnAdditionsInDay[currentDay];
            validVeOwn -= validVeOwnSubtractionsInDay[currentDay];

            uint256 dailyRewardAmountUpdate = dailyRewardValueHistory[
                currentDay
            ];
            if (dailyRewardAmountUpdate != 0) {
                dailyRewardAmountCurrent = dailyRewardAmountUpdate;
            }

            if (validVeOwn == 0) {
                continue;
            }
            console.log("Calculating rewards for day: %s", currentDay);
            console.log("Valid veOwn: %s", validVeOwn);
            console.log("Daily reward amount: %s", dailyRewardAmountCurrent);
            console.log("Boost multiplier: %s", boostMultiplier);

            // ISSUE: I'm a bit unsure about this condition, requires testing
            if (currentDay < _startDay) {
                continue;
            }

            rewardPerToken += _calculateRewardPerToken(
                dailyRewardAmountCurrent,
                boostMultiplier,
                validVeOwn
            );

            console.log("Reward per token: %s", rewardPerToken);
        }
    }

    // TODO: Pass through the weeklyRewardPerTokenCached
    // The validVeOwnAtEndOfWeek and boostMultiplierAtEndOfWeek are used to calculate the reward per token for the week
    // Unfortunately this assumes that the previous week has been processed. WHICH is a safe assumption in the claimRewards function because we always process beforehand
    // BUT the view methods won't work then, so we need to support them ......
    function _calculateRewardsForPosition(
        uint256 _positionId
    ) internal view returns (uint256 reward) {
        StakePosition storage position = positions[_positionId];

        uint256 currentWeek = getCurrentWeek();

        uint256 finalWeek = position.finalDay / 7;

        if (
            position.lastWeekRewardsClaimed == currentWeek ||
            position.lastWeekRewardsClaimed == finalWeek
        ) {
            return 0;
        }

        // TODO: THis needs to account for the fact that users can claim at any point after a week.

        uint256 startWeek = position.startDay / 7;

        uint256 lastDayOfFirstWeek = startWeek * 7 + 6;

        bool enteredAtStartOfWeek = position.startDay % 7 == 0;
        bool finalDayEndOfWeek = position.finalDay % 7 == 6;

        // Can only claim the first week of rewards once the week finishes AND
        // they have not claimed rewards for the first week
        if (
            currentWeek > startWeek &&
            startWeek == position.lastWeekRewardsClaimed &&
            // If they staked on the first day of the week, we can skip this and use the next for loop for less iterations
            !enteredAtStartOfWeek
        ) {
            uint256 firstWeekRewardPerToken = _rewardPerTokenForDayRange(
                position.startDay,
                lastDayOfFirstWeek
            );

            reward += (position.veOwnAmount * firstWeekRewardPerToken) / 1e18;
        }

        {
            uint256 startWeekToIterateFrom = position.lastWeekRewardsClaimed;
            // If they didn't enter at the start of the week, we need to start from the next week because the above logic will issue rewards for the first week
            if (!enteredAtStartOfWeek) {
                ++startWeekToIterateFrom;
            }

            uint256 finalWeekToIterateTo = currentWeek;
            if (currentWeek > finalWeek) {
                if (finalDayEndOfWeek) {
                    finalWeekToIterateTo = finalWeek;
                } else {
                    finalWeekToIterateTo = finalWeek - 1;
                }
            }

            // Iterate over every week, using the cached value for efficiency
            for (
                uint256 week = startWeekToIterateFrom;
                week < finalWeekToIterateTo;
                ++week
            ) {
                reward +=
                    (position.veOwnAmount *
                        rewardValuesWeeklyCache[week]
                            .weeklyRewardPerTokenCached) /
                    1e18;
            }
        }

        // Add rewards for the last week they stake for
        if (
            finalWeek > position.lastWeekRewardsClaimed &&
            currentWeek > finalWeek &&
            // This condition ensures that we use the more efficient weekly calculation above instead of the daily calculation here
            !finalDayEndOfWeek
        ) {
            uint256 firstDayOfFinalWeek = finalWeek * 7;
            uint256 lastWeekRewardPerToken = _rewardPerTokenForDayRange(
                firstDayOfFinalWeek,
                position.finalDay
            );

            reward += (position.veOwnAmount * lastWeekRewardPerToken) / 1e18;
        }
    }

    // **** Boost functions ****

    BoostDetails[] public boostDetails;

    function getBoostDetails() external view returns (BoostDetails[] memory) {
        return boostDetails;
    }

    uint256 public finalBoostWeek;

    function getCurrentBoostMultiplier() public view returns (uint256) {
        return getBoostMultiplierForWeek(getCurrentWeek());
    }

    function getBoostMultiplierForWeek(
        uint256 week
    ) public view returns (uint256) {
        uint256 weeksSinceStart = week - stakingStartWeek;

        return getBoostMultiplierForWeekSinceStart(weeksSinceStart);
    }

    function getBoostMultiplierForWeekSinceStart(
        uint256 _weekSinceStart
    ) public view returns (uint256) {
        if (boostDetails.length == 0 || _weekSinceStart > finalBoostWeek) {
            return 1 ether;
        }

        uint256 i = boostDetails.length;

        while (i > 0) {
            --i;

            uint256 boostStartWeek = boostDetails[i].startWeek;
            // Inclusive of the final week, so subtract 1
            uint256 boostFinalWeek = boostStartWeek +
                boostDetails[i].durationInWeeks -
                1;

            if (
                _weekSinceStart >= boostStartWeek &&
                _weekSinceStart <= boostFinalWeek
            ) {
                return boostDetails[i].multiplier;
            }
        }

        return 1 ether;
    }

    function addBoostDetails(
        BoostDetails[] calldata _boostDetails
    ) external onlyDefaultAdmin {
        uint256 newFinalBoostWeek;
        uint256 currentWeek = getCurrentWeek();
        uint256 weeksSinceStakingStarted;
        if (currentWeek < stakingStartWeek || stakingStartWeek == 0) {
            weeksSinceStakingStarted = 0;
        } else {
            weeksSinceStakingStarted = currentWeek - stakingStartWeek;
        }

        for (uint256 i; i < _boostDetails.length; ++i) {
            // If staking has started and trying to update a boost that has already started, revert
            if (
                currentWeek >= stakingStartWeek &&
                _boostDetails[i].startWeek < weeksSinceStakingStarted
            ) {
                revert CannotSetBoostForWeekInPast();
            }

            if (_boostDetails[i].durationInWeeks == 0) {
                revert CannotSetDurationInWeeksForBoostToZero();
            }
            // TODO: Revert if adding a boost start week that is in the past
            boostDetails.push(_boostDetails[i]);

            // Subtract 1 because its inclusive of the startWeek
            uint256 finalWeek = _boostDetails[i].startWeek +
                _boostDetails[i].durationInWeeks -
                1;

            if (finalWeek > newFinalBoostWeek) {
                newFinalBoostWeek = finalWeek;
            }
        }

        if (newFinalBoostWeek > finalBoostWeek) {
            finalBoostWeek = newFinalBoostWeek;
        }
    }
}
