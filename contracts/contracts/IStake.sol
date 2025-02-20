// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IStake {
    event Staked(
        address indexed user,
        uint256 positionId,
        uint256 amount,
        uint256 _weeks
    );

    struct StakePosition {
        uint256 ownAmount;
        uint256 veOwnAmount;
        uint256 startTime;
        uint256 endTime;
        uint256 lockWeeks;
        bool isActive;
    }
}
