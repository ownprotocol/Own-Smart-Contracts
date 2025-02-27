// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/extensions/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ISablierLockup} from "@sablier/lockup/src/interfaces/ISablierLockup.sol";

import "../interfaces/IStake.sol";
import "../interfaces/IveOwn.sol";

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
    uint256 public constant MAX_LOCK_WEEKS = 52; // 1 year
    uint256 public constant MIN_LOCK_WEEKS = 1;

    uint256 public weeklyRewardAmount;

    uint256 public totalPositions;

    uint256 public stakingStartWeek;

    mapping(uint256 => StakePosition) public positions;
    mapping(address => uint256[]) public usersPositions;
    mapping(uint256 => uint256[]) public positionExpiryByWeek;
    mapping(uint256 => uint256) public weeklyRewardPerTokenCached;
    mapping(uint256 => uint256) public veOwnPerWeekCache;

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

        uint256 currentWeek = getCurrentWeek();

        lastCachedWeek = currentWeek;
        stakingStartWeek = currentWeek;

        // MAX_LOCK_WEEKS = 52;
        // MIN_LOCK_WEEKS = 1;
    }

    function stake(uint256 _amount, uint256 _weeks) external nonReentrant {
        if (_weeks < MIN_LOCK_WEEKS || _weeks > MAX_LOCK_WEEKS) {
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
        uint256 veOwnAmount = _amount * _weeks;

        uint256 currentWeek = getCurrentWeek();
        // They will start earning rewards from the following week
        uint256 startWeek = currentWeek + 1;
        uint256 endWeek = startWeek + _weeks;
        uint256 positionId = totalPositions;

        // record their position
        positions[positionId] = StakePosition({
            owner: msg.sender,
            ownAmount: _amount,
            veOwnAmount: veOwnAmount,
            startWeek: startWeek,
            endWeek: endWeek,
            lastWeekOfRewardsClaimed: currentWeek
        });
        usersPositions[msg.sender].push(positionId);

        positionExpiryByWeek[endWeek].push(positionId);

        // Add their amount to the veOwnPerWeekCache for the next week
        veOwnPerWeekCache[currentWeek + 1] += veOwnAmount;

        totalPositions = positionId + 1;

        ownToken.safeTransferFrom(msg.sender, address(this), _amount);
        veOWN.mint(msg.sender, veOwnAmount);

        emit Staked(
            msg.sender,
            startWeek,
            endWeek,
            positionId,
            _amount,
            _weeks
        );
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

        (claimableRewards, totalRewards) = _calculateClaimableRewards(
            allUserPositions,
            false
        );
    }

    function _calculateClaimableRewards(
        uint256[] memory positionIds,
        bool _revertOnNoRewards
    )
        internal
        view
        returns (uint256[] memory rewardsPerPosition, uint256 totalRewards)
    {
        uint256 currentWeek = getCurrentWeek();

        rewardsPerPosition = new uint256[](positionIds.length);

        for (uint256 i = 0; i < positionIds.length; i++) {
            StakePosition storage position = positions[i];

            if (msg.sender != position.owner) {
                revert("Not the owner of the position");
            }

            if (position.lastWeekOfRewardsClaimed == currentWeek - 1) {
                if (_revertOnNoRewards) {
                    revert("No rewards to claim");
                } else {
                    continue;
                }
            }

            for (
                uint256 week = position.startWeek;
                week < currentWeek;
                ++week
            ) {
                rewardsPerPosition[i] +=
                    (position.veOwnAmount * weeklyRewardPerTokenCached[week]) /
                    1e18;
            }

            totalRewards += rewardsPerPosition[i];
        }

        return (rewardsPerPosition, totalRewards);
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

            uint256 currentWeek = getCurrentWeek();
            if (position.lastWeekOfRewardsClaimed == currentWeek - 1) {
                revert("No rewards to claim");
            }

            for (
                uint256 week = position.startWeek;
                week < currentWeek;
                ++week
            ) {
                // PBS ?
                reward +=
                    (position.veOwnAmount * weeklyRewardPerTokenCached[week]) /
                    1e18;
            }

            position.lastWeekOfRewardsClaimed = currentWeek;
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

        return 1; // No boost
    }

    function getPreviousWeekReturns() external returns (uint256) {
        // ISSUE: We need a view function that runs the _updateVeOwnPerWeekCache function in case there are missing weeks in the calculation
        uint256 currentWeek = getCurrentWeek();

        uint256 reward;

        for (uint256 i = 0; i < totalPositions; i++) {
            StakePosition storage position = positions[i];

            if (position.lastWeekOfRewardsClaimed == currentWeek - 1) {
                continue;
            }

            _updateVeOwnPerWeekCache();

            for (
                uint256 week = position.startWeek;
                week < currentWeek;
                ++week
            ) {
                reward +=
                    (position.veOwnAmount * weeklyRewardPerTokenCached[week]) /
                    1e18;
            }
        }

        return reward;
    }

    function getCurrentWeek() public view returns (uint256) {
        return block.timestamp / WEEK;
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
        stakingStartWeek = getCurrentWeek();
    }

    function setWeeklyRewardAmount(uint256 _amount) external onlyOwner {
        // Re-sync the cache, as we need to ensure that the previous weeklyRewardAmount is carried into the cache
        _updateVeOwnPerWeekCache();

        // TODO: Need to validate the amount value here

        weeklyRewardAmount = _amount;

        // TODO: Emit event
    }

    // **** Internal functions ****

    // TODO: add bool argument for whether to update the cache
    function _updateVeOwnPerWeekCache() internal {
        uint256 currentWeek = getCurrentWeek();

        // Run through all weeks from the last cached week to the current week
        for (uint256 week = lastCachedWeek + 1; week <= currentWeek; ++week) {
            // Start with the previous week and add the following week to account for new stakes
            uint256 currentWeekVeOwnTotal = veOwnPerWeekCache[week - 1] +
                veOwnPerWeekCache[week];

            uint256[] memory positionsExpiringInWeek = positionExpiryByWeek[
                week
            ];
            // Deduct the veOwnAmount of all positions expiring in the current week
            for (uint256 i = 0; i < positionsExpiringInWeek.length; ++i) {
                currentWeekVeOwnTotal -= positions[positionsExpiringInWeek[i]]
                    .veOwnAmount;
            }

            veOwnPerWeekCache[week] = currentWeekVeOwnTotal;

            weeklyRewardPerTokenCached[week] =
                (weeklyRewardAmount * getBoostMultiplier(week)) /
                currentWeekVeOwnTotal;
        }

        lastCachedWeek = currentWeek;
        // TODO: Update event
    }
}
