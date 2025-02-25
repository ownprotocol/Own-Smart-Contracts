// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "../interfaces/IPresale.sol";

contract Presale is Initializable, IPresale, OwnableUpgradeable {
    PresaleRound[] public presaleRounds;

    mapping(uint256 => uint256) public presaleTokensPurchased;

    uint256 public totalSales;

    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {}

    function addPresaleRounds(
        PresaleRound[] memory rounds
    ) external override onlyOwner {
        for (uint256 i = 0; i < rounds.length; i++) {
            rounds[i].sales = 0;
            presaleRounds.push(rounds[i]);
        }
    }
}
