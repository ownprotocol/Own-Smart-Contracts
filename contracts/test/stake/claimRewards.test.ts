import { parseEther } from "viem";
import { ownTestingAPI } from "../../helpers/testing-api";
import {
  OwnContract,
  StakeContract,
  Signers,
  VeOWN,
  MockSablierContract,
} from "../../types";
import { DayOfWeek, setDayOfWeekInHardhatNode } from "../../helpers/evm";
import { expect } from "chai";
import hre from "hardhat";

describe("Stake - claimRewards", async () => {
  let own: OwnContract;
  let stake: StakeContract;
  let signers: Signers;
  let veOwn: VeOWN;
  let mockSablierLockup: MockSablierContract;
  let alice: Signers[0];

  const dailyRewardAmount = parseEther("5");
  const weeks = 5;
  const duration = BigInt(7 * weeks);

  const stakeInitialBalance = parseEther("1000");

  beforeEach(async () => {
    ({ stake, own, veOwn, signers, mockSablierLockup } = await ownTestingAPI());
    alice = signers[1];
    await stake.write.setDailyRewardAmount([dailyRewardAmount]);

    await stake.write.startStakingNextWeek();

    await setDayOfWeekInHardhatNode(DayOfWeek.Friday);

    const ownBalance = await own.read.balanceOf([signers[0].account.address]);

    await own.write.transfer([stake.address, stakeInitialBalance]);

    await own.write.approve([stake.address, ownBalance]);
  });

  it("Should revert if calling from an account that doesn't own the stake", async () => {
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await expect(
      stake.write.claimRewards([[BigInt(0)]], { account: alice.account }),
    ).to.be.revertedWithCustomError(stake, "CallerDoesNotOwnPosition");
  });

  it("Should revert if calling before staking starts", async () => {
    await expect(
      stake.write.claimRewards([[BigInt(0)]]),
    ).to.be.revertedWithCustomError(stake, "StakingNotStarted");
  });

  it("Should revert if there are no rewards to be claimed", async () => {
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await stake.write.stake([parseEther("50"), duration]);

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await stake.write.claimRewards([[BigInt(0)]]);

    await expect(
      stake.write.claimRewards([[BigInt(0)]]),
    ).to.be.revertedWithCustomError(stake, "NoRewardsToClaim");
  });

  it("Should pull funds over from the Sablier contract if there isn't enough funds in the contract for rewards", async () => {
    await stake.write.setDailyRewardAmount([stakeInitialBalance]);

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    const boostMultiplier = await stake.read.getCurrentBoostMultiplier();

    await stake.write.stake([parseEther("50"), duration]);

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    const expectedRewards =
      (stakeInitialBalance * boostMultiplier * BigInt(6)) / BigInt(1e18);

    await mockSablierLockup.write.setWithdrawableAmount([expectedRewards]);
    await own.write.transfer([mockSablierLockup.address, expectedRewards]);

    expect(await own.read.balanceOf([stake.address])).to.lessThan(
      expectedRewards,
    );

    await expect(
      stake.write.claimRewards([[BigInt(0)]]),
    ).to.changeTokenBalances(own, [signers[0].account], [expectedRewards]);
  });

  it("Should revert if there aren't enough funds across vesting contract to satisfy rewrads", async () => {
    await stake.write.setDailyRewardAmount([stakeInitialBalance]);

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    await stake.write.stake([parseEther("50"), duration]);
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    await expect(
      stake.write.claimRewards([[BigInt(0)]]),
    ).to.revertedWithCustomError(
      stake,
      "NotEnoughFundsAcrossVestingContractForRewards",
    );
  });

  it("Should claim rewards in the first week of staking", async () => {
    // Skip to start of staking
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await setDayOfWeekInHardhatNode(DayOfWeek.Wednesday);

    const boostMultiplier = await stake.read.getCurrentBoostMultiplier();
    const dailyRewardAmount = await stake.read.dailyRewardAmount();

    const amount = parseEther("50");

    const stakeTx = stake.write.stake([amount, duration]);

    await expect(stakeTx).to.changeTokenBalances(
      own,
      [signers[0].account],
      [-amount],
    );

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    const totalRewards =
      ((dailyRewardAmount * boostMultiplier) / BigInt(1e18)) * BigInt(2);

    const [, claimableRewards] = await stake.read.getUsersPositionDetails([
      signers[0].account.address,
    ]);

    const claimRewardsTx = stake.write.claimRewards([[BigInt(0)]]);

    await expect(claimRewardsTx).to.changeTokenBalances(
      own,
      [signers[0].account],
      [totalRewards],
    );

    await expect(claimRewardsTx).to.emit(stake, "RewardsClaimed");

    expect(claimableRewards[0]).to.equal(totalRewards);

    const [, , , , , lastWeekRewardsClaimed] = await stake.read.positions([
      BigInt(0),
    ]);

    const currentWeek = await stake.read.getCurrentWeek();

    expect(lastWeekRewardsClaimed).to.equal(currentWeek);

    expect(await stake.read.totalRewardsIssued()).to.equal(totalRewards);
  });

  it("Should claim rewards for an entire week", async () => {
    await setDayOfWeekInHardhatNode(DayOfWeek.Friday);

    const amount = parseEther("50");

    await stake.write.stake([amount, duration]);

    // Skip to following saturday, so run this twice
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    const boostMultiplier = await stake.read.getCurrentBoostMultiplier();

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    const rewardsPerDay = (dailyRewardAmount * boostMultiplier) / BigInt(1e18);

    const totalRewards = rewardsPerDay * BigInt(7);

    const [, claimableRewards] = await stake.read.getUsersPositionDetails([
      signers[0].account.address,
    ]);

    await expect(
      stake.write.claimRewards([[BigInt(0)]]),
    ).to.changeTokenBalances(
      own,
      [signers[0].account],
      // Staked for 7 days
      [totalRewards],
    );
    expect(claimableRewards[0]).to.equal(totalRewards);

    const [, , , , , , rewardsClaimed] = await stake.read.positions([
      BigInt(0),
    ]);

    expect(rewardsClaimed).to.equal(totalRewards);
  });

  it("Should claim rewards for the first half of the first week and the entire second week", async () => {
    // Skip to start of staking
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await setDayOfWeekInHardhatNode(DayOfWeek.Wednesday);

    const amount = parseEther("50");

    await stake.write.stake([amount, duration]);

    const firstWeekRewards =
      ((dailyRewardAmount * (await stake.read.getCurrentBoostMultiplier())) /
        BigInt(1e18)) *
      BigInt(2);

    // Skip to following saturday, so run this twice
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    const secondWeekRewards =
      ((dailyRewardAmount * (await stake.read.getCurrentBoostMultiplier())) /
        BigInt(1e18)) *
      BigInt(7);

    const totalRewards = firstWeekRewards + secondWeekRewards;

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    const [, claimableRewards] = await stake.read.getUsersPositionDetails([
      signers[0].account.address,
    ]);

    await expect(
      stake.write.claimRewards([[BigInt(0)]]),
    ).to.changeTokenBalances(
      own,
      [signers[0].account],
      // Staked for 7 days
      [totalRewards],
    );

    expect(claimableRewards[0]).to.equal(totalRewards);
  });

  it("Should claim rewards for the first half of the first week and up to final day in the last week", async () => {
    // Skip to start of staking
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await setDayOfWeekInHardhatNode(DayOfWeek.Wednesday);

    const amount = parseEther("50");

    await stake.write.stake([amount, BigInt(7)]);

    const firstWeekRewards =
      ((dailyRewardAmount * (await stake.read.getCurrentBoostMultiplier())) /
        BigInt(1e18)) *
      BigInt(2);

    // Need to skip to following Saturday so rewards are processed
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    const secondWeekRewards =
      ((dailyRewardAmount * (await stake.read.getCurrentBoostMultiplier())) /
        BigInt(1e18)) *
      BigInt(5);

    const totalRewards = firstWeekRewards + secondWeekRewards;
    const [, claimableRewards] = await stake.read.getUsersPositionDetails([
      signers[0].account.address,
    ]);

    await expect(
      stake.write.claimRewards([[BigInt(0)]]),
    ).to.changeTokenBalances(
      own,
      [signers[0].account],
      // Staked for 7 days
      [firstWeekRewards + secondWeekRewards + amount],
    );

    expect(claimableRewards[0]).to.equal(totalRewards);
  });

  it("Should increase the rewards for the user when the daily reward amount is increased", async () => {
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    const boostMultiplier = await stake.read.getCurrentBoostMultiplier();

    await stake.write.stake([parseEther("50"), duration]);

    await setDayOfWeekInHardhatNode(DayOfWeek.Tuesday);

    const newDailyRewardAmount = parseEther("10");

    await stake.write.setDailyRewardAmount([newDailyRewardAmount]);

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    const rewardsForFirstHalf = dailyRewardAmount * BigInt(2);
    const rewardsForSecondHalf = newDailyRewardAmount * BigInt(4);

    const [details, claimableRewards] =
      await stake.read.getUsersPositionDetails([signers[0].account.address]);

    const totalRewards =
      ((rewardsForFirstHalf + rewardsForSecondHalf) * boostMultiplier) /
      BigInt(1e18);

    await expect(
      stake.write.claimRewards([[BigInt(0)]]),
    ).to.changeTokenBalances(own, [signers[0].account], [totalRewards]);

    expect(claimableRewards[0]).to.equal(totalRewards);
  });

  it("Should claim rewards for the 5 weeks the stake is active", async () => {
    // Skip to start of staking
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await setDayOfWeekInHardhatNode(DayOfWeek.Friday);

    const depositAmount = parseEther("50");

    await stake.write.stake([parseEther("50"), duration]);

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    let rewards = BigInt(0);

    const skipWeekAndAddToRewards = async () => {
      rewards +=
        ((dailyRewardAmount * (await stake.read.getCurrentBoostMultiplier())) /
          BigInt(1e18)) *
        BigInt(7);

      await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    };

    for (let i = 0; i < weeks - 1; i++) {
      await skipWeekAndAddToRewards();
    }

    // Skip an additional 5 weeks to ensure we only receive rewards whilst our stake is active
    for (let i = 0; i < 5; i++) {
      await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    }

    const [details, claimableRewards] =
      await stake.read.getUsersPositionDetails([signers[0].account.address]);

    await expect(
      stake.write.claimRewards([[BigInt(0)]]),
    ).to.changeTokenBalances(
      own,
      [signers[0].account],
      [rewards + depositAmount],
    );

    expect(claimableRewards[0] + depositAmount).to.equal(
      rewards + depositAmount,
    );

    const [, , , , finalDay, lastWeekRewardsClaimed] =
      await stake.read.positions([BigInt(0)]);

    const finalWeek = Math.floor(Number(finalDay) / 7);

    expect(lastWeekRewardsClaimed).to.equal(finalWeek);
  });

  describe("2 users", async () => {
    let stake_alice: StakeContract;

    beforeEach(async () => {
      await own.write.transfer([alice.account.address, parseEther("1000")]);

      await own.write.approve([stake.address, parseEther("1000")], {
        account: alice.account,
      });

      stake_alice = await hre.viem.getContractAt(
        "Stake",
        stake.address as `0x${string}`,
        { client: { wallet: alice } },
      );
    });

    it("Should receive half of the rewards for the second half of the first week, when a new user joins", async () => {
      // Skip to start of staking
      await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

      const amount = parseEther("50");

      const rewardsPerDay =
        (dailyRewardAmount * (await stake.read.getCurrentBoostMultiplier())) /
        BigInt(1e18);

      await stake.write.stake([amount, duration]);

      await setDayOfWeekInHardhatNode(DayOfWeek.Tuesday);

      await stake_alice.write.stake([amount, duration]);

      await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

      const rewardsForFirstHalfOfWeek = rewardsPerDay * BigInt(3);

      const rewardsForDeployer =
        rewardsForFirstHalfOfWeek + rewardsForFirstHalfOfWeek / BigInt(2);

      const [, claimableRewards] = await stake.read.getUsersPositionDetails([
        signers[0].account.address,
      ]);

      await expect(
        stake.write.claimRewards([[BigInt(0)]]),
      ).to.changeTokenBalances(own, [signers[0].account], [rewardsForDeployer]);
      expect(claimableRewards[0]).to.equal(rewardsForDeployer);

      const rewardsForAlice = rewardsForFirstHalfOfWeek / BigInt(2);
      const [, aliceClaimableRewards] =
        await stake.read.getUsersPositionDetails([alice.account.address]);

      await expect(
        stake_alice.write.claimRewards([[BigInt(1)]]),
      ).to.changeTokenBalances(own, [alice.account], [rewardsForAlice]);

      expect(aliceClaimableRewards[0]).to.equal(rewardsForAlice);
    });

    it("Should increase the rewards for a user, when another users stake ends", async () => {
      await setDayOfWeekInHardhatNode(DayOfWeek.Wednesday);

      const firstWeekBoostMultiplier =
        await stake.read.getCurrentBoostMultiplier();

      const amount = parseEther("50");

      await stake.write.stake([amount, duration]);

      await stake_alice.write.stake([amount, BigInt(7)]);

      await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

      const secondWeekBoostMultiplier =
        await stake.read.getCurrentBoostMultiplier();

      // Skip to following Saturday so rewards are processed
      await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

      const deployersVeOwn = amount * BigInt(weeks);
      // amount here is alice's veOwn amount
      const totalValidVeOwn = deployersVeOwn + amount;

      // Divide by 2 as we have 2 users for each day here
      const totalRewardsInFirstWeek =
        ((dailyRewardAmount * firstWeekBoostMultiplier) / BigInt(1e18)) *
        BigInt(2);

      const rewardsPerDayInSecondWeek =
        (dailyRewardAmount * secondWeekBoostMultiplier) / BigInt(1e18);

      const aliceShare = (amount * BigInt(1e18)) / totalValidVeOwn;

      const aliceRewardsInFirstWeek =
        (totalRewardsInFirstWeek * aliceShare) / BigInt(1e18);
      const aliceRewardsInSecondWeek =
        (rewardsPerDayInSecondWeek * BigInt(5) * aliceShare) / BigInt(1e18);

      const aliceTotalRewards =
        aliceRewardsInFirstWeek + aliceRewardsInSecondWeek;

      await expect(
        stake_alice.write.claimRewards([[BigInt(1)]]),
      ).to.changeTokenBalances(
        own,
        [alice.account],
        [aliceTotalRewards + amount],
      );

      const totalRewardsInBothWeeks =
        totalRewardsInFirstWeek + rewardsPerDayInSecondWeek * BigInt(7);

      const deployerRewards = totalRewardsInBothWeeks - aliceTotalRewards;

      // TODO: Fix this is off by a sliver
      //
      // const deployerShare = (deployersVeOwn * BigInt(1e18)) / totalValidVeOwn;
      //
      // const deployersRewardsInFirstWeek =
      //   (totalRewardsInFirstWeek * deployerShare) / BigInt(1e18);
      //
      // const deployersRewardsInSecondWeek =
      //   (rewardsPerDayInSecondWeek * BigInt(5) * deployerShare) / BigInt(1e18) +
      //   rewardsPerDayInSecondWeek * BigInt(2);
      //
      // await expect(
      //   stake.write.claimRewards([[BigInt(0)]]),
      // ).to.changeTokenBalances(own, [signers[0].account], [deployerRewards]);
    });
  });

  describe("Multiple users", async () => {
    // 5 users or something, different durations
    it("Should distribute rewards to users based on their stake", async () => {});
  });
});
