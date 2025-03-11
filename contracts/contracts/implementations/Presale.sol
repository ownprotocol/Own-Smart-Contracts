// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "../interfaces/IPresale.sol";
import "../interfaces/IOwn.sol";

contract Presale is
    Initializable,
    IPresale,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    IOwn public own;
    IERC20 public usdt;

    PresaleRound[] public presaleRounds;

    mapping(address => PresalePurchase[]) public presalePurchases;

    uint256 public startPresaleTime;

    uint256 public totalSales;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(IOwn _own, IERC20 _usdt) public initializer {
        __Ownable_init(_msgSender());
        __UUPSUpgradeable_init();

        own = _own;
        usdt = _usdt;
    }

    function _authorizeUpgrade(
        address _newImplementation
    ) internal override onlyOwner {}

    // *** Admin functions ***

    function addPresaleRounds(
        PresaleRound[] memory _rounds
    ) external override onlyOwner {
        uint256 allowableAllocation;
        uint256 totalPresaleDuration = startPresaleTime;

        for (uint256 i = 0; i < presaleRounds.length; ++i) {
            allowableAllocation +=
                presaleRounds[i].allocation -
                presaleRounds[i].sales;

            if (startPresaleTime != 0) {
                totalPresaleDuration += presaleRounds[i].duration;
            }
        }

        for (uint256 i = 0; i < _rounds.length; ++i) {
            if (_rounds[i].duration == 0) {
                revert CannotSetPresaleRoundDurationToZero();
            }

            if (_rounds[i].price == 0) {
                revert CannotSetPresaleRoundPriceToZero();
            }

            if (_rounds[i].allocation == 0) {
                revert CannotSetPresaleRoundAllocationToZero();
            }

            totalPresaleDuration += _rounds[i].duration;

            // NOTE: This check only works if the startPresaleTime is set
            // This has been noted by Fasset
            if (
                startPresaleTime != 0 &&
                _rounds[i].claimTokensTimestamp < totalPresaleDuration
            ) {
                revert CannotSetPresaleClaimTimestampToBeBeforeRoundEnd();
            }

            allowableAllocation += _rounds[i].allocation;
            _rounds[i].sales = 0;

            presaleRounds.push(_rounds[i]);
        }

        uint256 ownBalance = own.balanceOf(address(this));
        if (allowableAllocation > ownBalance) {
            revert InsufficientOwnBalanceForPresaleRounds(
                ownBalance,
                allowableAllocation
            );
        }

        emit PresaleRoundsAdded(_rounds);
    }

    function claimUSDT() external override onlyOwner {
        uint256 usdtBalance = usdt.balanceOf(address(this));
        usdt.transfer(owner(), usdtBalance);

        emit USDTClaimed(owner(), usdtBalance);
    }

    function claimBackPresaleTokens() external override onlyOwner {
        (bool roundsInProgress, ) = _getCurrentPresaleRoundId();

        if (roundsInProgress) {
            revert CannotClaimBackPresaleTokensWhilePresaleIsInProgress();
        }

        uint256 ownBalance = own.balanceOf(address(this));
        own.transfer(owner(), ownBalance);

        emit PresaleTokensClaimedBack(owner(), ownBalance);
    }

    function setPresaleStartTime(
        uint256 _startPresaleTime
    ) external override onlyOwner {
        if (_startPresaleTime < block.timestamp) {
            revert CannotSetPresaleStartTimeToPastTime();
        }

        if (startPresaleTime != 0 && startPresaleTime < block.timestamp) {
            revert CannotSetPresaleStartTimeOncePresaleHasStarted();
        }

        startPresaleTime = _startPresaleTime;

        emit PresaleStartTimeSet(_startPresaleTime);
    }

    // Updator methods

    modifier updatePresaleRound(uint256 _roundId) {
        (
            bool roundsInProgress,
            uint256 currentRoundId
        ) = _getCurrentPresaleRoundId();

        if (!roundsInProgress) {
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
        uint256 _roundId,
        uint256 _newDuration
    ) external override onlyOwner updatePresaleRound(_roundId) {
        if (_newDuration == 0) {
            revert CannotSetPresaleRoundDurationToZero();
        }

        uint256 oldDuration = presaleRounds[_roundId].duration;
        presaleRounds[_roundId].duration = _newDuration;

        emit PresaleRoundDurationUpdated(_roundId, _newDuration, oldDuration);
    }

    function updatePresaleRoundPrice(
        uint256 _roundId,
        uint256 _newPrice
    ) external override onlyOwner updatePresaleRound(_roundId) {
        if (_newPrice == 0) {
            revert CannotSetPresaleRoundPriceToZero();
        }

        uint256 oldPrice = presaleRounds[_roundId].price;
        presaleRounds[_roundId].price = _newPrice;

        emit PresaleRoundPriceUpdated(_roundId, _newPrice, oldPrice);
    }

    function updatePresaleRoundAllocation(
        uint256 _roundId,
        uint256 _newAllocation
    ) external override onlyOwner updatePresaleRound(_roundId) {
        if (_newAllocation == 0) {
            revert CannotSetPresaleRoundAllocationToZero();
        }

        uint256 oldAllocation = presaleRounds[_roundId].allocation;
        presaleRounds[_roundId].allocation = _newAllocation;

        emit PresaleRoundAllocationUpdated(
            _roundId,
            _newAllocation,
            oldAllocation
        );
    }

    function updatePresaleRoundClaimTimestamp(
        uint256 _roundId,
        uint256 _newClaimTimestamp
    ) external override onlyOwner updatePresaleRound(_roundId) {
        uint256 startPresaleTimeCache = startPresaleTime;

        if (startPresaleTimeCache != 0) {
            uint256 totalPresaleDuration = startPresaleTimeCache;

            // Count up to and including the round we are updating
            for (uint256 i = 0; i <= _roundId; ++i) {
                totalPresaleDuration += presaleRounds[i].duration;
            }

            if (_newClaimTimestamp < totalPresaleDuration) {
                revert CannotSetPresaleClaimTimestampToBeBeforeRoundEnd();
            }
        }

        uint256 oldClaimTimestamp = presaleRounds[_roundId]
            .claimTokensTimestamp;
        presaleRounds[_roundId].claimTokensTimestamp = _newClaimTimestamp;

        emit PresaleClaimTimestampUpdated(
            _roundId,
            _newClaimTimestamp,
            oldClaimTimestamp
        );
    }

    function setOwnAddress(IOwn _own) external override onlyOwner {
        if (address(_own) == address(0)) {
            revert CannotSetAddressToZero();
        }

        own = _own;

        emit OwnAddressSet(address(_own));
    }

    function setUSDTAddress(IERC20 _usdt) external override onlyOwner {
        if (address(_usdt) == address(0)) {
            revert CannotSetAddressToZero();
        }

        usdt = _usdt;

        emit USDTAddressSet(address(_usdt));
    }

    // *** Public functions ***

    function purchasePresaleTokens(
        uint256 _usdtAmount,
        address _receiver
    ) external override {
        if (!hasPresaleStarted()) {
            revert PresaleHasNotStarted();
        }

        (
            bool roundsInProgress,
            uint256 currentRoundId
        ) = _getCurrentPresaleRoundId();

        if (!roundsInProgress) {
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

        presalePurchases[_receiver].push(
            PresalePurchase(
                currentRoundId,
                amount,
                _usdtAmount,
                _receiver,
                block.timestamp,
                false
            )
        );

        usdt.transferFrom(msg.sender, address(this), _usdtAmount);

        emit PresaleTokensPurchased(
            _receiver,
            currentRoundId,
            amount,
            currentRoundPrice
        );
    }

    function claimPresaleRoundTokens() external override {
        (
            bool roundsInProgress,
            uint256 currentRoundId
        ) = _getCurrentPresaleRoundId();

        uint256 totalTokens;

        for (uint256 i = 0; i < presalePurchases[msg.sender].length; ++i) {
            if (!presalePurchases[msg.sender][i].claimed) {
                uint256 purchasedInPresaleRoundId = presalePurchases[
                    msg.sender
                ][i].roundId;

                if (
                    currentRoundId > purchasedInPresaleRoundId ||
                    !roundsInProgress
                ) {
                    if (
                        block.timestamp >=
                        presaleRounds[purchasedInPresaleRoundId]
                            .claimTokensTimestamp
                    ) {
                        totalTokens += presalePurchases[msg.sender][i]
                            .ownAmount;
                        presalePurchases[msg.sender][i].claimed = true;
                    }
                }
            }
        }

        if (totalTokens == 0) {
            revert NoPresaleTokensToClaim();
        }

        own.transfer(msg.sender, totalTokens);

        emit PresaleTokensClaimed(msg.sender, totalTokens);
    }

    // *** View methods ***

    function getUsersPresalePurchases(
        address _user
    ) external view override returns (PresalePurchase[] memory) {
        return presalePurchases[_user];
    }

    function getAllPresaleRounds()
        external
        view
        override
        returns (PresaleRound[] memory)
    {
        return presaleRounds;
    }

    function getCurrentPresaleRoundDetails()
        external
        view
        override
        returns (bool success, PresaleRound memory, uint256 roundId)
    {
        (
            bool roundsInProgress,
            uint256 currentPresaleRoundId
        ) = _getCurrentPresaleRoundId();

        if (!roundsInProgress) {
            return (false, PresaleRound(0, 0, 0, 0, 0), 0);
        }

        return (
            true,
            presaleRounds[currentPresaleRoundId],
            currentPresaleRoundId
        );
    }

    function hasPresaleStarted() public view override returns (bool) {
        return startPresaleTime != 0 && block.timestamp >= startPresaleTime;
    }

    // *** Internal view methods ***

    function _getCurrentPresaleRoundId()
        internal
        view
        returns (bool roundsInProgress, uint256 roundId)
    {
        uint256 presaleTimeElapsed;
        if (hasPresaleStarted()) {
            presaleTimeElapsed = block.timestamp - startPresaleTime;
        }

        for (uint256 i = 0; i < presaleRounds.length; ++i) {
            if (presaleTimeElapsed < presaleRounds[i].duration) {
                return (true, i);
            }

            presaleTimeElapsed -= presaleRounds[i].duration;
        }

        return (false, 0);
    }
}
