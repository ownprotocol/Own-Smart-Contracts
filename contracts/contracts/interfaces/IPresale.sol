// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IOwn.sol";

/**
 * @title IPresale Interface
 * @notice Interface for managing presale rounds and token purchases
 */
interface IPresale {
    /**
     * @notice Represents a single presale round
     * @param duration Total duration of the presale round in seconds
     * @param price Price of tokens in the current round (in USDT)
     * @param allocation Total number of tokens available in this round
     * @param sales Number of tokens already sold in this round
     */
    struct PresaleRound {
        uint256 duration;
        uint256 price;
        uint256 allocation;
        uint256 sales;
    }

    /**
     * @notice Represents a single presale token purchase
     * @dev Tracks individual user purchases across presale rounds
     * @param roundId ID of the presale round when purchase was made
     * @param ownAmount Number of OWN tokens purchased
     * @param usdtAmount Amount of USDT spent on the purchase
     * @param receiver Address that received the tokens
     * @param timestamp Timestamp of the purchase
     * @param claimed Whether tokens have been claimed by the user
     */
    struct PresalePurchase {
        uint256 roundId;
        uint256 ownAmount;
        uint256 usdtAmount;
        address receiver;
        uint256 timestamp;
        bool claimed;
    }

    /**
     * @notice Emitted when new presale rounds are added
     * @param rounds Array of newly added presale rounds
     */
    event PresaleRoundsAdded(PresaleRound[] rounds);

    /**
     * @notice Emitted when USDT is claimed by the contract owner
     * @param owner Address of the contract owner
     * @param amount Amount of USDT claimed
     */
    event USDTClaimed(address indexed owner, uint256 amount);

    /**
     * @notice Emitted when unsold presale tokens are reclaimed by the owner
     * @param owner Address of the contract owner
     * @param amount Number of tokens reclaimed
     */
    event PresaleTokensClaimedBack(address indexed owner, uint256 amount);

    /**
     * @notice Emitted when the presale start time is set
     * @param startTime Timestamp when presale begins
     */
    event PresaleStartTimeSet(uint256 startTime);

    /**
     * @notice Emitted when a presale round's duration is updated
     * @param roundId ID of the presale round
     * @param newDuration Updated duration of the round
     * @param oldDuration Previous duration of the round
     */
    event PresaleRoundDurationUpdated(
        uint256 roundId,
        uint256 newDuration,
        uint256 oldDuration
    );

    /**
     * @notice Emitted when a presale round's price is updated
     * @param roundId ID of the presale round
     * @param newPrice Updated price of tokens in the round
     * @param oldPrice Previous price of tokens in the round
     */
    event PresaleRoundPriceUpdated(
        uint256 roundId,
        uint256 newPrice,
        uint256 oldPrice
    );

    /**
     * @notice Emitted when a presale round's allocation is updated
     * @param roundId ID of the presale round
     * @param newAllocation Updated token allocation for the round
     * @param oldAllocation Previous token allocation for the round
     */
    event PresaleRoundAllocationUpdated(
        uint256 roundId,
        uint256 newAllocation,
        uint256 oldAllocation
    );

    /**
     * @notice Emitted when presale tokens are purchased
     * @param receiver Address receiving the tokens
     * @param roundId ID of the presale round
     * @param amount Number of tokens purchased
     * @param price Price per token in the round
     */
    event PresaleTokensPurchased(
        address indexed receiver,
        uint256 roundId,
        uint256 amount,
        uint256 price
    );

    /**
     * @notice Emitted when the own address is set
     * @param ownAddress Address of the own token contract
     */
    event OwnAddressSet(address indexed ownAddress);

    /**
     * @notice Emitted when the USDT address is set
     * @param usdtAddress Address of the USDT token contract
     */
    event USDTAddressSet(address indexed usdtAddress);

    /**
     * @notice Emitted when a user claims their presale tokens
     * @param user Address of the user claiming tokens
     * @param amount Number of tokens claimed
     */
    event PresaleTokensClaimed(address indexed user, uint256 amount);

    /**
     * @notice Error thrown when attempting to set a presale round duration to zero
     */
    error CannotSetPresaleRoundDurationToZero();

    /**
     * @notice Error thrown when attempting to set a presale round price to zero
     */
    error CannotSetPresaleRoundPriceToZero();

    /**
     * @notice Error thrown when attempting to set a presale round allocation to zero
     */
    error CannotSetPresaleRoundAllocationToZero();

    /**
     * @notice Error thrown when the contract's OWN token balance is insufficient for presale rounds
     * @param balance Current balance of OWN tokens
     * @param allocation Total allocation requested
     */
    error InsufficientOwnBalanceForPresaleRounds(
        uint256 balance,
        uint256 allocation
    );

    /**
     * @notice Error thrown when attempting to claim back tokens while presale is in progress
     */
    error CannotClaimBackPresaleTokensWhilePresaleIsInProgress();

    /**
     * @notice Error thrown when trying to set presale start time to a past time
     */
    error CannotSetPresaleStartTimeToPastTime();

    /**
     * @notice Error thrown when attempting to modify presale start time after presale has begun
     */
    error CannotSetPresaleStartTimeOncePresaleHasStarted();

    /**
     * @notice Error thrown when all presale rounds have ended
     */
    error AllPresaleRoundsHaveEnded();

    /**
     * @notice Error thrown when attempting to update a round that has ended or is in progress
     */
    error CannotUpdatePresaleRoundThatHasEndedOrInProgress();

    /**
     * @notice Error thrown when trying to access a presale round that does not exist
     */
    error PresaleRoundIndexOutOfBounds();

    /**
     * @notice Error thrown when attempting to purchase tokens before presale start
     */
    error PresaleHasNotStarted();

    /**
     * @notice Error thrown when attempting to claim presale tokens but there is none to claim
     */
    error NoPresaleTokensToClaim();

    /**
     * @notice Error thrown when requested purchase amount exceeds remaining round allocation
     * @param remaining Remaining tokens in the round
     * @param requested Tokens requested for purchase
     */
    error InsufficientBalanceInPresaleRoundForSale(
        uint256 remaining,
        uint256 requested
    );

    /**
     * @notice Error thrown when attempting to set a contract address to zero
     */
    error CannotSetAddressToZero();

    /**
     * @notice Adds new presale rounds to the contract
     * @dev Can only be called by the contract owner
     * @param _rounds Array of presale rounds to be added
     */
    function addPresaleRounds(PresaleRound[] memory _rounds) external;

    /**
     * @notice Allows the owner to claim accumulated USDT
     * @dev Can only be called by the contract owner
     */
    function claimUSDT() external;

    /**
     * @notice Updates the duration of a future presale round
     * @dev Can only be called by the contract owner for future rounds
     * @param _roundId ID of the round to update
     * @param _newDuration New duration for the round
     */
    function updatePresaleRoundDuration(
        uint256 _roundId,
        uint256 _newDuration
    ) external;

    /**
     * @notice Updates the price of a future presale round
     * @dev Can only be called by the contract owner for future rounds
     * @param _roundId ID of the round to update
     * @param _newPrice New price for the round
     */
    function updatePresaleRoundPrice(
        uint256 _roundId,
        uint256 _newPrice
    ) external;

    /**
     * @notice Updates the allocation of a future presale round
     * @dev Can only be called by the contract owner for future rounds
     * @param _roundId ID of the round to update
     * @param _newAllocation New token allocation for the round
     */
    function updatePresaleRoundAllocation(
        uint256 _roundId,
        uint256 _newAllocation
    ) external;

    /**
     * @notice Allows users to purchase presale tokens
     * @param _usdtAmount Amount of USDT to spend
     * @param _receiver Address to receive the tokens
     */
    function purchasePresaleTokens(
        uint256 _usdtAmount,
        address _receiver
    ) external;

    /**
     * @notice Allows users to claim their presale tokens
     * @dev Iterates through user's unclaimed purchases and transfers tokens for rounds that have ended
     * @dev Reverts if no tokens are available for claiming
     */
    function claimPresaleRoundTokens() external;

    /**
     * @notice Allows the owner to claim back unsold presale tokens
     * @dev Reverts if called while a presale round is in progress
     */
    function claimBackPresaleTokens() external;

    /**
     * @notice Sets the timestamp for when the presale starts
     * @dev Can only be called by the contract owner
     * @param _startTime Timestamp when presale begins
     */
    function setPresaleStartTime(uint256 _startTime) external;

    /**
     * @notice Sets the address of the OWN token contract
     * @dev Can only be called by the contract owner
     * @param _own Address of the OWN token contract
     */
    function setOwnAddress(IOwn _own) external;

    /**
     * @notice Sets the address of the USDT token contract
     * @dev Can only be called by the contract owner
     * @param _usdt Address of the USDT token contract
     */
    function setUSDTAddress(IERC20 _usdt) external;

    /**
     * @notice Retrieves all presale purchases for a specific user
     * @param _user Address of the user to retrieve purchases for
     * @return An array of PresalePurchase structs for the given user
     */
    function getUsersPresalePurchases(
        address _user
    ) external view returns (PresalePurchase[] memory);

    /**
     * @notice Retrieves all presale rounds configured in the contract
     * @return An array of all PresaleRound structs
     */
    function getAllPresaleRounds()
        external
        view
        returns (PresaleRound[] memory);

    /**
     * @notice Gets details of the current active presale round
     * @dev Returns false and zero values if no rounds are in progress
     * @return success Boolean indicating if a round is currently active
     * @return round Details of the current presale round
     * @return roundId ID of the current presale round
     */
    function getCurrentPresaleRoundDetails()
        external
        view
        returns (bool success, PresaleRound memory round, uint256 roundId);

    /**
     * @notice Checks if the presale has started
     * @return Boolean indicating whether the presale start time has been set and reached
     */
    function hasPresaleStarted() external view returns (bool);

    /**
     * @notice Gets the OWN token contract used in the presale
     * @return The IOwn token contract instance
     */
    function own() external view returns (IOwn);

    /**
     * @notice Gets the USDT token contract used for purchases
     * @return The IERC20 token contract instance for USDT
     */
    function usdt() external view returns (IERC20);

    /**
     * @notice Gets the timestamp when the presale starts
     * @return The block timestamp when the presale begins
     */
    function startPresaleTime() external view returns (uint256);

    /**
     * @notice Gets the total number of tokens sold across all presale rounds
     * @return The total number of tokens sold
     */
    function totalSales() external view returns (uint256);
}
