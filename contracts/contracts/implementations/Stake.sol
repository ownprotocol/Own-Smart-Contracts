// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/access/extensions/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "../interfaces/IStake.sol";
import "../interfaces/IveOwn.sol";
import "../interfaces/IOwn.sol";
import "../interfaces/ISablierLockup.sol";

contract Stake is
    Initializable,
    IStake,
    AccessControlEnumerableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable
{
    using SafeERC20 for IOwn;

    IOwn public ownToken;
    IveOwn public veOwn;
    ISablierLockup public sablierLockup;

    uint256 public sablierStreamId;

    uint256 public maximumLockDays;
    uint256 public minimumLockDays;

    uint256 public dailyRewardAmount;
    uint256 public maximumDailyRewardAmount;

    uint256 public lastRewardValuesWeeklyCachedWeek;

    uint256 public stakingStartWeek;

    uint256 public totalStaked;

    uint256 public totalRewardsIssued;

    // Tracks all users who have staked at some point
    uint256 public totalUsers;

    uint256 public totalPositions;
    mapping(uint256 => StakePosition) public positions;
    mapping(address => uint256[]) public usersPositions;
    mapping(uint256 => uint256) public validVeOwnAdditionsInDay;
    mapping(uint256 => uint256) public validVeOwnSubtractionsInDay;

    mapping(uint256 => uint256) public dailyRewardValueHistory;
    mapping(uint256 => RewardValuesWeeklyCache) public rewardValuesWeeklyCache;

    modifier onlyDefaultAdmin() {
        if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) {
            revert CallerIsNotTheAdmin();
        }
        _;
    }

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        IOwn _ownToken,
        IveOwn _veOWN,
        ISablierLockup _sablierLockup
    ) public initializer {
        __AccessControlEnumerable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        ownToken = _ownToken;
        veOwn = _veOWN;
        sablierLockup = _sablierLockup;

        // 52 weeks
        maximumLockDays = 364;
        minimumLockDays = 7;
    }

    function _authorizeUpgrade(
        address _newImplementation
    ) internal override onlyDefaultAdmin {}

    function stake(
        uint256 _amount,
        uint256 _days
    ) external override nonReentrant {
        if (_days < minimumLockDays || _days > maximumLockDays) {
            revert InvalidLockPeriod();
        }
        if (_amount == 0) {
            revert CannotStakeZeroAmount();
        }

        if (!hasStakingStarted()) {
            revert StakingNotStarted();
        }

        _updateWeeklyRewardValuesCache();

        uint256 totalWeeks = _days / 7;

        // NOTE: There is no maximum multiplier here
        uint256 veOwnAmount = _amount * totalWeeks;

        uint256 currentDay = getCurrentDay();
        uint256 currentWeek = getCurrentWeek();

        // They will start earning rewards from the next day
        uint256 startDay = currentDay + 1;

        // Inclusive of the final day so subtract 1
        uint256 finalDay = startDay + _days - 1;
        uint256 positionId = totalPositions;

        if (usersPositions[msg.sender].length == 0) {
            ++totalUsers;
        }

        // record their position
        positions[positionId] = StakePosition({
            owner: msg.sender,
            ownAmount: _amount,
            veOwnAmount: veOwnAmount,
            startDay: startDay,
            // Rewards are inclusive of the last day
            finalDay: finalDay,
            lastWeekRewardsClaimed: currentWeek,
            rewardsClaimed: 0
        });
        usersPositions[msg.sender].push(positionId);

        validVeOwnAdditionsInDay[startDay] += veOwnAmount;
        validVeOwnSubtractionsInDay[finalDay + 1] += veOwnAmount;

        totalStaked += _amount;

        ++totalPositions;

        ownToken.safeTransferFrom(msg.sender, address(this), _amount);
        veOwn.mint(msg.sender, veOwnAmount);

        emit Staked(msg.sender, startDay, finalDay, positionId, _amount, _days);
    }

    function claimRewards(
        uint256[] calldata _positionIds
    ) external override nonReentrant {
        if (!hasStakingStarted()) {
            revert StakingNotStarted();
        }

        _updateWeeklyRewardValuesCache();

        uint256 currentWeek = getCurrentWeek();

        uint256[] memory rewardPerPosition = new uint256[](_positionIds.length);
        uint256 totalReward;

        for (uint256 i = 0; i < _positionIds.length; ++i) {
            uint256 positionId = _positionIds[i];

            if (msg.sender != positions[positionId].owner) {
                revert CallerDoesNotOwnPosition();
            }

            uint256 positionLastWeekRewardsClaimed = positions[positionId]
                .lastWeekRewardsClaimed;

            if (currentWeek == positionLastWeekRewardsClaimed) {
                continue;
            }

            uint256 reward = _calculateRewardsForPosition(
                _positionIds[i],
                new RewardValuesWeeklyCache[](0)
            );

            totalReward += reward;
            rewardPerPosition[i] = reward;
            positions[positionId].rewardsClaimed += reward;

            uint256 finalWeek = positions[positionId].finalDay / 7;
            if (currentWeek > finalWeek) {
                positions[positionId].lastWeekRewardsClaimed = finalWeek;

                uint256 ownAmount = positions[positionId].ownAmount;

                totalReward += ownAmount;
                totalStaked -= ownAmount;
            } else {
                positions[positionId].lastWeekRewardsClaimed = currentWeek;
            }
        }

        if (totalReward == 0) {
            revert NoRewardsToClaim();
        }

        // Should be safe to deduct the total reward from the total staked amount because we never issue more than what is held by the contract
        uint256 remainingBalanceForRewards = ownToken.balanceOf(address(this)) -
            totalStaked;

        if (totalReward > remainingBalanceForRewards) {
            uint256 withdrawableAmount = sablierLockup.withdrawableAmountOf(
                sablierStreamId
            );

            if (remainingBalanceForRewards + withdrawableAmount < totalReward) {
                revert NotEnoughFundsAcrossVestingContractForRewards(
                    totalReward,
                    withdrawableAmount,
                    remainingBalanceForRewards
                );
            }

            sablierLockup.withdrawMax(sablierStreamId, address(this));
        }

        totalRewardsIssued += totalReward;

        ownToken.safeTransfer(msg.sender, totalReward);

        emit RewardsClaimed(
            msg.sender,
            _positionIds,
            rewardPerPosition,
            totalReward
        );
    }

    // **** Read functions ****
    function getUsersPositionDetails(
        address _user
    )
        external
        view
        override
        returns (
            StakePosition[] memory userPositions,
            uint256[] memory claimableRewardsPerPosition
        )
    {
        uint256 usersTotalPositions = usersPositions[_user].length;

        userPositions = new StakePosition[](usersTotalPositions);
        claimableRewardsPerPosition = new uint256[](usersTotalPositions);

        (
            RewardValuesWeeklyCache[] memory updatedCacheValues,

        ) = _getValuesToUpdateWeeklyRewardValuesCache();

        for (uint256 i = 0; i < usersTotalPositions; ++i) {
            uint256 positionId = usersPositions[_user][i];

            userPositions[i] = positions[positionId];

            claimableRewardsPerPosition[i] = _calculateRewardsForPosition(
                positionId,
                updatedCacheValues
            );
        }
    }

    function getPreviousWeekReturns() external view override returns (uint256) {
        uint256 currentWeek = getCurrentWeek();

        (
            RewardValuesWeeklyCache[] memory updatedCacheValues,

        ) = _getValuesToUpdateWeeklyRewardValuesCache();

        RewardValuesWeeklyCache memory cache = _getRewardValuesCacheForWeek(
            currentWeek - 1,
            updatedCacheValues
        );

        return cache.weeklyRewardPerTokenCached;
    }

    // Because in this contract weeks start from Saturday 00:00:00 UTC and UTC starts from Thursday we deduct 2 so that a Saturday is considered the start of a week
    function getCurrentDay() public view override returns (uint256) {
        return block.timestamp / 1 days - 2;
    }

    function getCurrentWeek() public view override returns (uint256) {
        return getCurrentDay() / 7;
    }

    function getWeekSinceStakingStarted()
        public
        view
        override
        returns (uint256)
    {
        if (stakingStartWeek == 0) {
            return 0;
        }

        uint256 currentWeek = getCurrentWeek();

        if (currentWeek < stakingStartWeek) {
            return 0;
        }

        return (currentWeek + 1) - stakingStartWeek;
    }

    function getUsersPositions(
        address _user
    ) external view override returns (StakePosition[] memory userPositions) {
        uint256[] memory userPositionIds = usersPositions[_user];

        userPositions = new StakePosition[](userPositionIds.length);

        for (uint256 i = 0; i < userPositionIds.length; ++i) {
            userPositions[i] = positions[userPositionIds[i]];
        }
    }

    function hasStakingStarted() public view override returns (bool) {
        return stakingStartWeek != 0 && stakingStartWeek <= getCurrentWeek();
    }

    // **** Admin functions ****

    function setSablierStreamId(
        uint256 _streamId
    ) external override onlyDefaultAdmin {
        sablierStreamId = _streamId;

        emit SablierStreamIdSet(_streamId);
    }

    function startStakingNextWeek() external override onlyDefaultAdmin {
        if (dailyRewardAmount == 0) {
            revert CannotStartStakingWithoutDailyRewardSet();
        }

        if (stakingStartWeek != 0) {
            revert StakingAlreadyStarted();
        }

        uint256 currentWeek = getCurrentWeek();

        stakingStartWeek = currentWeek + 1;

        lastRewardValuesWeeklyCachedWeek = currentWeek;

        rewardValuesWeeklyCache[currentWeek] = RewardValuesWeeklyCache({
            weeklyRewardPerTokenCached: 0,
            validVeOwnAtEndOfWeek: 0,
            dailyRewardAmountAtEndOfWeek: dailyRewardAmount
        });

        emit StartStakingNextWeek(stakingStartWeek);
    }

    function setMaximumDailyRewardAmount(
        uint256 _amount
    ) external override onlyDefaultAdmin {
        if (_amount == 0) {
            revert CannotSetMaximumDailyRewardAmountToZero();
        }

        maximumDailyRewardAmount = _amount;

        emit MaximumDailyRewardAmountSet(getCurrentDay(), _amount);
    }

    function setDailyRewardAmount(
        uint256 _amount
    ) external override onlyDefaultAdmin {
        if (hasStakingStarted()) {
            // Re-sync the cache, as we need to ensure that the previous weeklyRewardAmount is carried into the cache
            _updateWeeklyRewardValuesCache();
        }

        if (_amount == 0) {
            revert CannotSetDailyRewardAmountToZero();
        }

        if (_amount > maximumDailyRewardAmount) {
            revert DailyRewardAmountExceedsMaximum(
                _amount,
                maximumDailyRewardAmount
            );
        }

        uint256 currentWeek = getCurrentWeek();

        // This side steps a pretty inconsenquential issue where the admin:
        // Sets the daily reward amount, calls startStakingNextWeek(), then sets the daily reward amount again BEFORE staking starts
        if (
            rewardValuesWeeklyCache[currentWeek].dailyRewardAmountAtEndOfWeek !=
            0
        ) {
            rewardValuesWeeklyCache[currentWeek]
                .dailyRewardAmountAtEndOfWeek = _amount;
        }

        uint256 currentDay = getCurrentDay();

        dailyRewardValueHistory[currentDay] = _amount;
        dailyRewardAmount = _amount;

        emit DailyRewardAmountSet(currentDay, _amount);
    }

    function setOwnAddress(IOwn _own) external override onlyDefaultAdmin {
        if (address(_own) == address(0)) {
            revert CannotSetAddressToZero();
        }

        ownToken = _own;

        emit OwnAddressSet(address(_own));
    }

    function setVeOwnAddress(IveOwn _veOwn) external override onlyDefaultAdmin {
        if (address(_veOwn) == address(0)) {
            revert CannotSetAddressToZero();
        }

        veOwn = _veOwn;

        emit VeOwnAddressSet(address(_veOwn));
    }

    function setSablierLockupAddress(
        ISablierLockup _sablierLockup
    ) external override onlyDefaultAdmin {
        if (address(_sablierLockup) == address(0)) {
            revert CannotSetAddressToZero();
        }

        sablierLockup = _sablierLockup;

        emit SablierLockupAddressSet(address(_sablierLockup));
    }

    // **** Internal functions ****

    function _calculateRewardPerToken(
        uint256 _dailyRewardAmount,
        uint256 _boostMultiplier,
        uint256 _validVeOwn
    ) internal pure returns (uint256) {
        // Everything is scaled by 1e18 so we don't need to divide by 1e18 at the end
        return (_dailyRewardAmount * _boostMultiplier) / _validVeOwn;
    }

    function _updateWeeklyRewardValuesCache() internal {
        (
            RewardValuesWeeklyCache[] memory updatedCacheValues,
            uint256 fromWeek
        ) = _getValuesToUpdateWeeklyRewardValuesCache();

        if (updatedCacheValues.length == 0) {
            return;
        }

        for (uint256 i = 0; i < updatedCacheValues.length; ++i) {
            rewardValuesWeeklyCache[fromWeek + i] = updatedCacheValues[i];
        }

        lastRewardValuesWeeklyCachedWeek = getCurrentWeek() - 1;
    }

    function _getValuesToUpdateWeeklyRewardValuesCache()
        internal
        view
        returns (
            RewardValuesWeeklyCache[] memory updatedCacheValues,
            uint256 fromWeek
        )
    {
        uint256 _currentVeOwnTotal = rewardValuesWeeklyCache[
            lastRewardValuesWeeklyCachedWeek
        ].validVeOwnAtEndOfWeek;

        uint256 _dailyRewardCurrent = rewardValuesWeeklyCache[
            lastRewardValuesWeeklyCachedWeek
        ].dailyRewardAmountAtEndOfWeek;

        uint256 currentWeek = getCurrentWeek();

        fromWeek = lastRewardValuesWeeklyCachedWeek + 1;

        if (fromWeek == currentWeek) {
            return (updatedCacheValues, fromWeek);
        }

        uint256 totalWeeksToUpdate = currentWeek - fromWeek;
        updatedCacheValues = new RewardValuesWeeklyCache[](totalWeeksToUpdate);

        // Run through all weeks from the last cached week to the current week
        for (uint256 week = fromWeek; week < currentWeek; ++week) {
            uint256 boostMultiplier = getBoostMultiplierForWeek(week);

            uint256 rewardPerTokenInWeek;

            // Iterate over each day and calculate the reward per token for that day
            // Add it to the cumulative reward per token for the week
            for (uint256 day; day < 7; ++day) {
                uint256 currentDay = week * 7 + day;

                _currentVeOwnTotal += validVeOwnAdditionsInDay[currentDay];
                _currentVeOwnTotal -= validVeOwnSubtractionsInDay[currentDay];

                // If the admin changed the daily reward amount we need to update the cache
                uint256 dailyRewardAmountUpdate = dailyRewardValueHistory[
                    currentDay
                ];

                if (dailyRewardAmountUpdate != 0) {
                    _dailyRewardCurrent = dailyRewardAmountUpdate;
                }

                if (_currentVeOwnTotal == 0) {
                    continue;
                }

                rewardPerTokenInWeek += _calculateRewardPerToken(
                    _dailyRewardCurrent,
                    boostMultiplier,
                    _currentVeOwnTotal
                );
            }

            updatedCacheValues[week - fromWeek] = RewardValuesWeeklyCache({
                weeklyRewardPerTokenCached: rewardPerTokenInWeek,
                validVeOwnAtEndOfWeek: _currentVeOwnTotal,
                dailyRewardAmountAtEndOfWeek: _dailyRewardCurrent
            });
        }

        return (updatedCacheValues, fromWeek);
    }

    function _rewardPerTokenForDayRange(
        uint256 _startDay,
        uint256 _finalDay,
        RewardValuesWeeklyCache[] memory _tempCache
    ) internal view returns (uint256 rewardPerToken) {
        uint256 previousWeek = _startDay / 7 - 1;
        RewardValuesWeeklyCache memory cache = _getRewardValuesCacheForWeek(
            previousWeek,
            _tempCache
        );
        uint256 validVeOwn = cache.validVeOwnAtEndOfWeek;
        uint256 dailyRewardAmountCurrent = cache.dailyRewardAmountAtEndOfWeek;

        uint256 boostMultiplier = getBoostMultiplierForWeek(previousWeek + 1);

        uint256 firstDayOfWeek = _startDay - (_startDay % 7);
        for (
            // This starts off with the first day of the week
            uint256 currentDay = firstDayOfWeek;
            currentDay <= _finalDay;
            ++currentDay
        ) {
            validVeOwn += validVeOwnAdditionsInDay[currentDay];
            validVeOwn -= validVeOwnSubtractionsInDay[currentDay];

            uint256 dailyRewardAmountUpdate = dailyRewardValueHistory[
                currentDay
            ];
            if (dailyRewardAmountUpdate != 0) {
                dailyRewardAmountCurrent = dailyRewardAmountUpdate;
            }

            if (validVeOwn == 0) {
                continue;
            }

            // If the day we are accessing is before the start day, we can skip it
            if (_startDay > currentDay) {
                continue;
            }

            rewardPerToken += _calculateRewardPerToken(
                dailyRewardAmountCurrent,
                boostMultiplier,
                validVeOwn
            );
        }
    }

    function _getRewardValuesCacheForWeek(
        uint256 _week,
        RewardValuesWeeklyCache[] memory _tempCache
    ) internal view returns (RewardValuesWeeklyCache memory) {
        if (_week <= lastRewardValuesWeeklyCachedWeek) {
            return rewardValuesWeeklyCache[_week];
        }

        uint256 weekDiff = _week - lastRewardValuesWeeklyCachedWeek;

        // Arrays start from 0, so subtract 1
        RewardValuesWeeklyCache memory value = _tempCache[weekDiff - 1];

        return value;
    }

    function _calculateRewardsForPosition(
        uint256 _positionId,
        RewardValuesWeeklyCache[] memory _tempCache
    ) internal view returns (uint256 reward) {
        uint256 currentWeek = getCurrentWeek();

        uint256 finalWeek = positions[_positionId].finalDay / 7;

        uint256 positionLastWeekRewardsClaimed = positions[_positionId]
            .lastWeekRewardsClaimed;

        if (
            positionLastWeekRewardsClaimed == currentWeek ||
            positionLastWeekRewardsClaimed == finalWeek
        ) {
            return 0;
        }

        uint256 positionStartDay = positions[_positionId].startDay;
        uint256 positionFinalDay = positions[_positionId].finalDay;
        uint256 positionVeOwnAmount = positions[_positionId].veOwnAmount;

        uint256 startWeek = positionStartDay / 7;

        uint256 lastDayOfFirstWeek = startWeek * 7 + 6;

        bool enteredAtStartOfWeek = positionStartDay % 7 == 0;
        bool finalDayEndOfWeek = positionFinalDay % 7 == 6;

        // Can only claim the first week of rewards once the week finishes AND
        // they have not claimed rewards for the first week
        if (
            currentWeek > startWeek &&
            startWeek == positionLastWeekRewardsClaimed &&
            // If they staked on the first day of the week, we can skip this and use the next for loop for less iterations
            !enteredAtStartOfWeek
        ) {
            uint256 firstWeekRewardPerToken = _rewardPerTokenForDayRange(
                positionStartDay,
                lastDayOfFirstWeek,
                _tempCache
            );

            reward += (positionVeOwnAmount * firstWeekRewardPerToken) / 1e18;
        }

        {
            uint256 startWeekToIterateFrom = positionLastWeekRewardsClaimed;
            // If they didn't enter at the start of the week, we need to start from the next week because the above logic will issue rewards for the first week
            if (!enteredAtStartOfWeek) {
                ++startWeekToIterateFrom;
            }

            uint256 finalWeekToIterateTo = currentWeek;
            if (currentWeek > finalWeek) {
                if (finalDayEndOfWeek) {
                    finalWeekToIterateTo = finalWeek;
                } else {
                    finalWeekToIterateTo = finalWeek - 1;
                }
            }

            // Iterate over every week, using the cached value for efficiency
            for (
                uint256 week = startWeekToIterateFrom;
                week < finalWeekToIterateTo;
                ++week
            ) {
                RewardValuesWeeklyCache
                    memory cache = _getRewardValuesCacheForWeek(
                        week,
                        _tempCache
                    );
                reward +=
                    (positionVeOwnAmount * cache.weeklyRewardPerTokenCached) /
                    1e18;
            }
        }

        // Add rewards for the last week they stake for
        if (
            finalWeek > positionLastWeekRewardsClaimed &&
            currentWeek > finalWeek &&
            // This condition ensures that we use the more efficient weekly calculation above instead of the daily calculation here
            !finalDayEndOfWeek
        ) {
            uint256 firstDayOfFinalWeek = finalWeek * 7;
            uint256 lastWeekRewardPerToken = _rewardPerTokenForDayRange(
                firstDayOfFinalWeek,
                positionFinalDay,
                _tempCache
            );

            reward += (positionVeOwnAmount * lastWeekRewardPerToken) / 1e18;
        }
    }

    // **** Boost functions ****

    BoostDetails[] public boostDetails;

    function getBoostDetails()
        external
        view
        override
        returns (BoostDetails[] memory)
    {
        return boostDetails;
    }

    uint256 public finalBoostWeek;

    function getCurrentBoostMultiplier()
        public
        view
        override
        returns (uint256)
    {
        return getBoostMultiplierForWeek(getCurrentWeek());
    }

    function getBoostMultiplierForWeek(
        uint256 _week
    ) public view override returns (uint256) {
        uint256 weeksSinceStart = _week - stakingStartWeek;

        return getBoostMultiplierForWeekSinceStart(weeksSinceStart);
    }

    function getBoostMultiplierForWeekSinceStart(
        uint256 _weekSinceStart
    ) public view override returns (uint256) {
        if (boostDetails.length == 0 || _weekSinceStart > finalBoostWeek) {
            return 1 ether;
        }

        uint256 i = boostDetails.length;

        while (i > 0) {
            --i;

            uint256 boostStartWeek = boostDetails[i].startWeek;
            // Inclusive of the final week, so subtract 1
            uint256 boostFinalWeek = boostStartWeek +
                boostDetails[i].durationInWeeks -
                1;

            if (
                _weekSinceStart >= boostStartWeek &&
                _weekSinceStart <= boostFinalWeek
            ) {
                return boostDetails[i].multiplier;
            }
        }

        return 1 ether;
    }

    function addBoostDetails(
        BoostDetails[] calldata _boostDetails
    ) external override onlyDefaultAdmin {
        uint256 newFinalBoostWeek;
        uint256 currentWeek = getCurrentWeek();
        uint256 weeksSinceStakingStarted;
        if (currentWeek < stakingStartWeek || stakingStartWeek == 0) {
            weeksSinceStakingStarted = 0;
        } else {
            weeksSinceStakingStarted = currentWeek - stakingStartWeek;
        }

        for (uint256 i; i < _boostDetails.length; ++i) {
            // If staking has started and trying to update a boost that has already started, revert
            if (
                currentWeek >= stakingStartWeek &&
                _boostDetails[i].startWeek < weeksSinceStakingStarted
            ) {
                revert CannotSetBoostForWeekInPast();
            }

            if (_boostDetails[i].durationInWeeks == 0) {
                revert CannotSetDurationInWeeksForBoostToZero();
            }

            boostDetails.push(_boostDetails[i]);

            // Subtract 1 because its inclusive of the startWeek
            uint256 finalWeek = _boostDetails[i].startWeek +
                _boostDetails[i].durationInWeeks -
                1;

            if (finalWeek > newFinalBoostWeek) {
                newFinalBoostWeek = finalWeek;
            }
        }

        if (newFinalBoostWeek > finalBoostWeek) {
            finalBoostWeek = newFinalBoostWeek;
        }

        emit BoostDetailsAdded(_boostDetails);
    }
}
