// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface IPresale {
    struct PresaleRound {
        uint256 duration;
        uint256 price;
        uint256 allocation;
        uint256 sales;
    }

    // *** View methods ***

    // function getCurrentPresaleRoundDetails()
    //     external
    //     returns (bool isPresaleFinished, PresaleRound memory, uint256 roundId);

    // *** Admin functions ***

    // // Revert if trying to update a presale round that has concluded
    // function updatePresaleRoundDuration(
    //     uint256 roundId,
    //     uint256 newDuration
    // ) external;
    //
    // function updatePresaleRoundPrice(
    //     uint256 roundId,
    //     uint256 newPrice
    // ) external;
    //
    // // Checks contract has enough OWN to handle the increased allocation
    // function updatePresaleAllocation(
    //     uint256 roundId,
    //     uint256 allocation
    // ) external;
    //
    // Appends presale rounds
    // Checks contract has enough OWN for all presale rounds
    function addPresaleRounds(PresaleRound[] memory rounds) external;
    //
    // function claimUSDT() external;
    //
    // // *** User functions ***
    //
    // // Stores USDT, calculates the equivalent amount of pre sale tokens and increments presaleTokensPurchased for the receiver
    // function purchaseTokens(uint256 usdtAmount, address receiver) external;
    //
    // // Reverts if the last presale round hasn't ended
    // // Transfers the users presale tokens
    // function claimPresaleTokens() external;
}
