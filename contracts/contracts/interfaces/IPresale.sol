// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IPresale {
    struct PresaleRound {
        uint256 duration;
        uint256 price;
        uint256 allocation;
        uint256 sales;
    }

    struct PresalePurchase {
        uint256 roundId;
        uint256 ownAmount;
        uint256 usdtAmount;
        address buyer;
        uint256 purchasedOn;
        bool claimed;
    }

    // *** Events ***

    event PresaleRoundsAdded(PresaleRound[] rounds);

    event PresaleRoundDurationUpdated(
        uint256 roundId,
        uint256 newDuration,
        uint256 oldDuration
    );

    event PresaleRoundPriceUpdated(
        uint256 roundId,
        uint256 newPrice,
        uint256 oldPrice
    );

    event PresaleRoundAllocationUpdated(
        uint256 roundId,
        uint256 newAllocation,
        uint256 oldAllocation
    );

    event PresaleTokensPurchased(
        address indexed buyer,
        uint256 indexed roundId,
        uint256 indexed amount,
        uint256 price
    );

    event PresaleTokensClaimed(address indexed receiver, uint256 amount);

    event USDTClaimed(address indexed receiver, uint256 amount);

    event PresaleStartTimeSet(uint256 startTime);

    event PresaleTokensClaimedBack(address indexed receiver, uint256 amount);

    // *** Errors ***

    error AllPresaleRoundsHaveEnded();

    error CannotUpdatePresaleRoundThatHasEndedOrInProgress();

    error CannotSetPresaleRoundDurationToZero();

    error CannotSetPresaleRoundPriceToZero();

    error CannotSetPresaleRoundAllocationToZero();

    error InsufficientOwnBalanceForPresaleRounds(
        uint256 currentBalance,
        uint256 requiredBalance
    );

    error InsufficientBalanceInPresaleRoundForSale(
        uint256 currentBalance,
        uint256 requiredBalance
    );

    error PresaleRoundIndexOutOfBounds();

    error CannotSetPresaleStartTimeToPastTime();

    error CannotSetPresaleStartTimeOncePresaleHasStarted();

    error PresaleHasNotStarted();

    error NoPresaleTokensToClaim();

    error CannotClaimBackPresaleTokensWhilePresaleIsInProgress();

    // *** View methods ***

    function getCurrentPresaleRoundDetails()
        external
        returns (bool isPresaleFinished, PresaleRound memory, uint256 roundId);

    // *** Admin functions ***

    // Revert if trying to update a presale round that has concluded
    function updatePresaleRoundDuration(
        uint256 roundId,
        uint256 newDuration
    ) external;

    function updatePresaleRoundPrice(
        uint256 roundId,
        uint256 newPrice
    ) external;

    // Checks contract has enough OWN to handle the increased allocation
    function updatePresaleRoundAllocation(
        uint256 roundId,
        uint256 allocation
    ) external;

    function addPresaleRounds(PresaleRound[] memory rounds) external;

    function claimUSDT() external;

    // *** User functions ***

    // Stores USDT, calculates the equivalent amount of pre sale tokens and increments presaleTokensPurchased for the receiver
    function purchasePresaleTokens(
        uint256 usdtAmount,
        address receiver
    ) external;
    //
    // // Reverts if the last presale round hasn't ended
    // // Transfers the users presale tokens
    // function claimPresaleTokens() external;
}
