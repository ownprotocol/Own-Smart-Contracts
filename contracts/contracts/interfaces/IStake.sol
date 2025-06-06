// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./IOwn.sol";
import "./IveOwn.sol";
import "./ISablierLockup.sol";

/**
 * @title IStake Interface
 */
interface IStake {
    /**
     * @notice Represents a single staking position
     * @param owner Address of the position owner
     * @param positionId Unique identifier for the stake position
     * @param ownAmount Number of OWN tokens staked
     * @param veOwnAmount Voting escrow OWN tokens generated
     * @param startDay First day of the staking position
     * @param finalDay Last day of the staking position
     * @param lastWeekRewardsClaimed Last week for which rewards were claimed
     * @param rewardsClaimed Total rewards claimed so far
     */
    struct StakePosition {
        address owner;
        uint256 positionId;
        uint256 ownAmount;
        uint256 veOwnAmount;
        uint256 startDay;
        uint256 finalDay;
        uint256 lastWeekRewardsClaimed;
        uint256 rewardsClaimed;
    }

    /**
     * @notice Represents boost details for staking rewards
     * @param startWeek Week when the boost begins
     * @param durationInWeeks Number of weeks the boost is active
     * @param multiplier Reward multiplier during the boost period
     */
    struct BoostDetails {
        uint256 startWeek;
        uint256 durationInWeeks;
        uint256 multiplier;
    }

    /**
     * @notice Cached weekly reward values
     * @param weeklyRewardPerTokenCached Calculated reward per token for the week
     * @param validVeOwnAtEndOfWeek Total voting escrow OWN at week's end
     * @param dailyRewardAmountAtEndOfWeek Daily reward amount for the week
     */
    struct RewardValuesWeeklyCache {
        uint256 weeklyRewardPerTokenCached;
        uint256 validVeOwnAtEndOfWeek;
        uint256 dailyRewardAmountAtEndOfWeek;
    }

    // Events

    /**
     * @notice Emitted when tokens are staked
     * @param staker Address of the staker
     * @param startDay First day of staking
     * @param finalDay Last day of staking
     * @param positionId Unique identifier for the stake position
     * @param amount Number of tokens staked
     * @param lockDays Number of days tokens are locked
     */
    event Staked(
        address indexed staker,
        uint256 startDay,
        uint256 finalDay,
        uint256 positionId,
        uint256 amount,
        uint256 lockDays
    );

    /**
     * @notice Emitted when rewards are claimed
     * @param claimer Address claiming rewards
     * @param positionIds Array of stake position IDs
     * @param rewardsPerPosition Rewards for each position
     * @param totalReward Total rewards claimed
     */
    event RewardsClaimed(
        address indexed claimer,
        uint256[] positionIds,
        uint256[] rewardsPerPosition,
        uint256 totalReward
    );

    /**
     * @notice Emitted when the principle is emergency withdrawn
     * @param claimer Address of the claimer
     * @param positionIds Array of stake position IDs
     * @param amount Amount of tokens withdrawn
     */
    event EmergencyWithdrawStakePrinciple(
        address indexed claimer,
        uint256[] positionIds,
        uint256 amount
    );

    /**
     * @notice Emitted when Sablier stream ID is set
     * @param streamId ID of the Sablier stream
     */
    event SablierStreamIdSet(uint256 streamId);

    /**
     * @notice Emitted when staking is started
     * @param startWeek Week when staking begins
     */
    event StartStakingNextWeek(uint256 startWeek);

    /**
     * @notice Emitted when daily reward amount is set
     * @param day Day the reward is set
     * @param amount New daily reward amount
     */
    event DailyRewardAmountSet(uint256 day, uint256 amount);

    /**
     * @notice Emitted when boost details are added
     * @param boostDetails Array of boost details added
     */
    event BoostDetailsAdded(BoostDetails[] boostDetails);

    /**
     * @notice Emitted when maximum daily reward amount is set
     * @param day Day the maximum daily reward amount is set
     * @param amount New maximum daily reward amount
     */
    event MaximumDailyRewardAmountSet(uint256 day, uint256 amount);

    /**
     * @notice Emitted when the Own addres is set
     * @param ownAddress Address of the Own token
     */
    event OwnAddressSet(address ownAddress);

    /**
     * @notice Emitted when the veOwn address is set
     * @param veOwnAddress Address of the veOwn token
     */
    event VeOwnAddressSet(address veOwnAddress);

    /**
     * @notice Emitted when the SablierLockup address is set
     * @param sablierLockupAddress Address of the SablierLockup contract
     */
    event SablierLockupAddressSet(address sablierLockupAddress);

    // Custom Errors

    /// @notice Thrown when the caller is not the admin
    error CallerIsNotTheAdmin();

    /// @notice Thrown when attempting to stake an invalid lock period
    error InvalidLockPeriod();

    /// @notice Thrown when attempting to stake zero amount
    error CannotStakeZeroAmount();

    /// @notice Thrown when staking has not started
    error StakingNotStarted();

    /// @notice Thrown when the caller does not own the position
    error CallerDoesNotOwnPosition();

    /// @notice Thrown when there are no rewards to claim
    error NoRewardsToClaim();

    /// @notice Thrown when the user tries to emergency withdraw their stake but there is nothing to claim
    error NoEmergencyPrincipleToWithdraw();

    /// @notice Thrown when there are insufficient funds for rewards
    error NotEnoughFundsAcrossVestingContractForRewards(
        uint256 totalReward,
        uint256 withdrawableAmount,
        uint256 remainingBalance
    );

    /// @notice Thrown when attempting to start staking without setting daily reward
    error CannotStartStakingWithoutDailyRewardSet();

    /// @notice Thrown when staking has already started
    error StakingAlreadyStarted();

    /// @notice Thrown when attempting to set daily reward amount to zero
    error CannotSetDailyRewardAmountToZero();

    /// @notice Thrown when attempting to set boost for a week in the past
    error CannotSetBoostForCurrentOrPastWeek();

    /// @notice Thrown when attempting to set boost duration to zero
    error CannotSetDurationInWeeksForBoostToZero();

    /// @notice Thrown when setting the maximum daily reward amount to zero
    error CannotSetMaximumDailyRewardAmountToZero();

    /// @notice Thrown when daily reward amount exceeds maximum daily reward amount
    error DailyRewardAmountExceedsMaximum(
        uint256 dailyRewardAmount,
        uint256 maximumDailyRewardAmount
    );

    /// @notice Error thrown when attempting to set a contract address to zero
    error CannotSetAddressToZero();

    // Core Staking Functions

    /**
     * @notice Allows users to stake OWN tokens
     * @param _amount Number of tokens to stake
     * @param _days Number of days to lock tokens
     */
    function stake(uint256 _amount, uint256 _days) external;

    /**
     * @notice Allows users to claim rewards for specific stake positions
     * @param _positionIds Array of stake position IDs to claim rewards for
     */
    function claimRewards(uint256[] calldata _positionIds) external;

    /**
     * @notice Allows users to emergency withdraw their staked tokens
     * @notice This foregoes any pending rewards and just withdraws the principle
     * @param _positionIds Array of stake position IDs to withdraw from
     */
    function emergencyWithdrawStakePrinciple(
        uint256[] calldata _positionIds
    ) external;

    /**
     *@notice Allows for the weekly rewards values cache to be updated
     **/
    function updateWeeklyRewardValuesCache() external;

    // Admin Functions

    /**
     * @notice Sets the Sablier stream ID for rewards
     * @param _streamId ID of the Sablier stream
     */
    function setSablierStreamId(uint256 _streamId) external;

    /**
     * @notice Starts staking in the next week
     */
    function startStakingNextWeek() external;

    /**
     * @notice Sets the daily reward amount
     * @param _amount New daily reward amount
     */
    function setDailyRewardAmount(uint256 _amount) external;

    /**
     * @notice Sets the maximum daily reward amount
     * @param _amount New maximum daily reward amount
     */
    function setMaximumDailyRewardAmount(uint256 _amount) external;

    /**
     * @notice Sets the Own token address
     * @param _own Address of the Own token
     */
    function setOwnAddress(IOwn _own) external;

    /**
     * @notice Sets the veOwn token address
     * @param _veOwn Address of the veOwn token
     */
    function setVeOwnAddress(IveOwn _veOwn) external;

    /**
     * @notice Sets the SablierLockup address
     * @param _sablierLockup Address of the SablierLockup contract
     */
    function setSablierLockupAddress(ISablierLockup _sablierLockup) external;

    /**
     * @notice Adds boost details for staking rewards
     * @param _boostDetails Array of boost details to add
     */
    function addBoostDetails(BoostDetails[] calldata _boostDetails) external;

    // View Functions

    /**
     * @notice Retrieves user's stake position details
     * @param _user Address of the user
     * @return userPositions Array of user's stake positions
     * @return claimableRewardsPerPosition Claimable rewards for each position
     */
    function getUsersPositionDetails(
        address _user
    )
        external
        view
        returns (
            StakePosition[] memory userPositions,
            uint256[] memory claimableRewardsPerPosition
        );

    /**
     * @notice Gets the returns from the previous week
     * @return Weekly return amount
     */
    function getPreviousWeekReturns() external view returns (uint256);

    /**
     * @notice Gets the users active veOwn balance, which is the amount of veOwn issued by stakes that are active
     * @param _user Address of the user
     * @return balance The active veOwn balance of the user
     */
    function getUsersActiveVeOwnBalance(
        address _user
    ) external view returns (uint256 balance);

    /**
     * @notice Gets the total active veOwn supply, which is the total amount of veOwn issued by stakes that are active
     * @return totalVeOwnSupply The total active veOwn supply
     */
    function getTotalActiveVeOwnSupply()
        external
        view
        returns (uint256 totalVeOwnSupply);

    /**
     * @notice Checks if staking has started
     * @return Boolean indicating if staking has begun
     */
    function hasStakingStarted() external view returns (bool);

    /**
     * @notice Gets the current boost multiplier
     * @return Current boost multiplier
     */
    function getCurrentBoostMultiplier() external view returns (uint256);

    /**
     * @notice Retrieves boost details
     * @return Array of boost details
     */
    function getBoostDetails() external view returns (BoostDetails[] memory);

    /**
     * @notice Retrieves the boost multiplier for a specific week
     * @param _week The week number to get the boost multiplier for
     * @return The boost multiplier for the specified week
     */
    function getBoostMultiplierForWeek(
        uint256 _week
    ) external view returns (uint256);

    /**
     * @notice Calculates the boost multiplier for a specific week since staking start
     * @param _weekSinceStart Number of weeks since staking started
     * @return The boost multiplier (defaults to 1 ether if no matching boost found)
     */
    function getBoostMultiplierForWeekSinceStart(
        uint256 _weekSinceStart
    ) external view returns (uint256);

    /**
     * @notice Gets the current day number
     * @return The current day number
     */
    function getCurrentDay() external view returns (uint256);

    /**
     * @notice Gets the current week number
     * @return The current week number
     */
    function getCurrentWeek() external view returns (uint256);

    /**
     * @notice Calculates weeks since staking began
     * @return Number of weeks since staking started (0 if not started)
     */
    function getWeekSinceStakingStarted() external view returns (uint256);

    /**
     * @notice Retrieves all stake positions for a user
     * @param _user Address of the user to fetch positions for
     * @return userPositions Array of user's stake positions
     */
    function getUsersPositions(
        address _user
    ) external view returns (StakePosition[] memory userPositions);
}
