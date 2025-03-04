// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IStake {
    struct StakePosition {
        address owner;
        uint256 ownAmount;
        uint256 veOwnAmount;
        uint256 startDay;
        uint256 finalDay;
        uint256 lastWeekRewardsClaimed;
    }

    struct BoostDetails {
        uint256 durationInWeeks;
        uint256 startWeek;
        uint256 multiplier;
    }

    // *** Errors ***
    error CannotStakeZeroAmount();

    error InvalidLockPeriod();

    error StakingNotStarted();

    error CallerDoesNotOwnPosition();

    error NoRewardsToClaim();

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
}
