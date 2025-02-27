// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../interfaces/IPresale.sol";

import "hardhat/console.sol";

contract Presale is Initializable, IPresale, OwnableUpgradeable {
    IERC20 public own;
    IERC20 public usdt;

    PresaleRound[] public presaleRounds;

    uint256 public startPresaleTime;

    uint256 public totalSales;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(IERC20 _own, IERC20 _usdt) public initializer {
        // TODO: Can you use msg.sender here?
        __Ownable_init(_msgSender());

        own = _own;
        usdt = _usdt;
        startPresaleTime = block.timestamp;
    }

    // *** Admin functions ***

    function addPresaleRounds(
        PresaleRound[] memory rounds
    ) external override onlyOwner {
        uint256 allowableAllocation;

        for (uint256 i = 0; i < presaleRounds.length; i++) {
            allowableAllocation +=
                presaleRounds[i].allocation -
                presaleRounds[i].sales;
        }

        for (uint256 i = 0; i < rounds.length; i++) {
            if (rounds[i].duration == 0) {
                revert CannotSetPresaleRoundDurationToZero();
            }

            if (rounds[i].price == 0) {
                revert CannotSetPresaleRoundPriceToZero();
            }

            if (rounds[i].allocation == 0) {
                revert CannotSetPresaleRoundAllocationToZero();
            }

            allowableAllocation += rounds[i].allocation;
            rounds[i].sales = 0;

            presaleRounds.push(rounds[i]);
        }

        uint256 veOwnBalance = own.balanceOf(address(this));
        if (allowableAllocation > veOwnBalance) {
            revert InsufficientOwnBalanceForPresaleRounds(
                veOwnBalance,
                allowableAllocation
            );
        }

        emit PresaleRoundsAdded(rounds);
    }

    function claimUSDT() external override onlyOwner {
        uint256 usdtBalance = usdt.balanceOf(address(this));
        usdt.transfer(owner(), usdtBalance);

        emit USDTClaimed(owner(), usdtBalance);
    }

    // Updator methods

    modifier updatePresaleRound(uint256 _roundId) {
        (bool success, uint256 currentRoundId) = _getCurrentPresaleRoundId();

        if (!success) {
            revert AllPresaleRoundsHaveEnded();
        }

        if (currentRoundId >= _roundId) {
            revert CannotUpdatePresaleRoundThatHasEndedOrInProgress();
        }

        if (_roundId >= presaleRounds.length) {
            revert PresaleRoundIndexOutOfBounds();
        }

        _;
    }

    function updatePresaleRoundDuration(
        uint256 roundId,
        uint256 newDuration
    ) external override onlyOwner updatePresaleRound(roundId) {
        if (newDuration == 0) {
            revert CannotSetPresaleRoundDurationToZero();
        }

        uint256 oldDuration = presaleRounds[roundId].duration;
        presaleRounds[roundId].duration = newDuration;

        emit PresaleRoundDurationUpdated(roundId, newDuration, oldDuration);
    }

    function updatePresaleRoundPrice(
        uint256 roundId,
        uint256 newPrice
    ) external override onlyOwner updatePresaleRound(roundId) {
        if (newPrice == 0) {
            revert CannotSetPresaleRoundPriceToZero();
        }

        uint256 oldPrice = presaleRounds[roundId].price;
        presaleRounds[roundId].price = newPrice;

        emit PresaleRoundPriceUpdated(roundId, newPrice, oldPrice);
    }

    function updatePresaleRoundAllocation(
        uint256 roundId,
        uint256 newAllocation
    ) external override onlyOwner updatePresaleRound(roundId) {
        if (newAllocation == 0) {
            revert CannotSetPresaleRoundAllocationToZero();
        }

        uint256 oldAllocation = presaleRounds[roundId].allocation;
        presaleRounds[roundId].allocation = newAllocation;

        emit PresaleRoundAllocationUpdated(
            roundId,
            newAllocation,
            oldAllocation
        );
    }

    // *** Public functions ***

    function purchasePresaleTokens(
        uint256 _usdtAmount,
        address _receiver
    ) external override {
        (bool success, uint256 currentRoundId) = _getCurrentPresaleRoundId();

        if (!success) {
            revert AllPresaleRoundsHaveEnded();
        }

        uint256 currentRoundPrice = presaleRounds[currentRoundId].price;
        uint256 currentRoundAllocation = presaleRounds[currentRoundId]
            .allocation;
        uint256 currentRoundSales = presaleRounds[currentRoundId].sales;

        uint256 amount = (_usdtAmount * 1e18) / currentRoundPrice;
        uint256 remainingAllocation = currentRoundAllocation -
            currentRoundSales;

        if (amount > remainingAllocation) {
            revert InsufficientBalanceInPresaleRoundForSale(
                remainingAllocation,
                amount
            );
        }

        presaleRounds[currentRoundId].sales += amount;
        totalSales += amount;

        usdt.transferFrom(msg.sender, address(this), _usdtAmount);
        own.transfer(_receiver, amount);

        emit PresaleTokensPurchased(
            _receiver,
            currentRoundId,
            amount,
            currentRoundPrice
        );
    }

    function getAllPresaleRounds()
        external
        view
        returns (PresaleRound[] memory)
    {
        return presaleRounds;
    }

    // *** View methods ***

    function getCurrentPresaleRoundDetails()
        external
        view
        override
        returns (bool success, PresaleRound memory, uint256 roundId)
    {
        (
            bool successCurrentPresaleRoundId,
            uint256 currentPresaleRoundId
        ) = _getCurrentPresaleRoundId();

        if (!successCurrentPresaleRoundId) {
            return (false, PresaleRound(0, 0, 0, 0), 0);
        }

        return (
            true,
            presaleRounds[currentPresaleRoundId],
            currentPresaleRoundId
        );
    }

    // *** Internal view methods ***
    function _getCurrentPresaleRoundId()
        internal
        view
        returns (bool success, uint256 roundId)
    {
        uint256 presaleTimeElapsed = block.timestamp - startPresaleTime;

        for (uint256 i = 0; i < presaleRounds.length; i++) {
            if (presaleTimeElapsed < presaleRounds[i].duration) {
                return (true, i);
            }

            presaleTimeElapsed -= presaleRounds[i].duration;
        }

        return (false, 0);
    }
}
