// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IStake {
    struct StakePosition {
        address owner;
        uint256 ownAmount;
        uint256 veOwnAmount;
        uint256 startWeek;
        uint256 endWeek;
        uint256 lastWeekOfRewardsClaimed;
    }

    // *** Errors ***
    error CannotStakeZeroAmount();

    error InvalidLockPeriod();

    error StakingNotStarted();

    // *** Events ***
    event Staked(
        address indexed user,
        uint256 startWeek,
        uint256 endWeek,
        uint256 positionId,
        uint256 amount,
        uint256 _weeks
    );
}
