// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IStake {
    // *** Structs ***

    struct StakePosition {
        address owner;
        uint256 ownAmount;
        uint256 veOwnAmount;
        uint256 startDay;
        uint256 finalDay;
        uint256 lastWeekRewardsClaimed;
        uint256 rewardsClaimed;
    }

    struct BoostDetails {
        uint256 durationInWeeks;
        uint256 startWeek;
        uint256 multiplier;
    }

    struct RewardValuesWeeklyCache {
        // This value is used to calculate the reward per token for the week when claiming rewards
        uint256 weeklyRewardPerTokenCached;
        // All these values are used in recalculation of subsequent weeks
        uint256 validVeOwnAtEndOfWeek;
        uint256 dailyRewardAmountAtEndOfWeek;
    }

    // *** Errors ***

    error CannotStakeZeroAmount();

    error InvalidLockPeriod();

    error StakingNotStarted();

    error CallerDoesNotOwnPosition();

    error NoRewardsToClaim();

    error CannotSetBoostForWeekInPast();

    error CannotSetDurationInWeeksForBoostToZero();

    error CallerIsNotTheAdmin();

    error CannotSetDailyRewardAmountToZero();

    error NotEnoughFundsAcrossVestingContractForRewards(
        uint256 rewardsNeeded,
        uint256 vestingBalance,
        uint256 contractBalanceAllocatedForRewards
    );

    // *** Events ***

    event Staked(
        address indexed user,
        uint256 startWeek,
        uint256 endWeek,
        uint256 positionId,
        uint256 amount,
        uint256 _weeks
    );

    event RewardsClaimed(
        address indexed user,
        uint256[] positionIds,
        uint256[] rewardPerPosition,
        uint256 totalReward
    );

    event DailyRewardAmountSet(uint256 day, uint256 amount);

    event BoostDetailsAdded(BoostDetails[] _boostDetails);
}
