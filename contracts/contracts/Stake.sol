// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./IStake.sol";
import "./veOWN.sol";

contract Stake is IStake, AccessControlEnumerable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public ownToken;
    VeOWN public veOWN;

    // Constants
    uint256 public constant WEEK = 7 days;
    uint256 public constant MAX_LOCK_WEEKS = 208; // 4 years
    uint256 public constant MIN_LOCK_WEEKS = 1;

    // User address => position ID => StakePosition
    mapping(address => mapping(uint256 => StakePosition)) public positions;
    // User address => number of positions
    mapping(address => uint256) public userPositionCount;

    constructor(address _ownToken) {
        ownToken = IERC20(_ownToken);
    }

    function stake(uint256 amount, uint256 _weeks) external nonReentrant {
        require(
            _weeks >= MIN_LOCK_WEEKS && _weeks <= MAX_LOCK_WEEKS,
            "Invalid lock period"
        );
        require(amount > 0, "Amount must be greater than 0");

        // Transfer tokens to contract
        ownToken.safeTransferFrom(msg.sender, address(this), amount);

        // Calculate veOwn amount (1:1 per week locked)
        uint256 veOwnAmount = amount * _weeks;

        // Create new position
        uint256 positionId = userPositionCount[msg.sender];

        // mint the user their veOWN
        veOWN.mint(msg.sender, veOwnAmount);

        // record their position
        positions[msg.sender][positionId] = StakePosition({
            ownAmount: amount,
            veOwnAmount: veOwnAmount,
            startTime: block.timestamp,
            endTime: block.timestamp + (_weeks * WEEK),
            lockWeeks: _weeks,
            isActive: true
        });

        userPositionCount[msg.sender]++;

        emit Staked(msg.sender, positionId, amount, _weeks);
    }
}
