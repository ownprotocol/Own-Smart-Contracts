import { parseEther } from "viem";
import { ownTestingAPI } from "../../helpers/testing-api";
import { OwnContract, StakeContract, Signers, VeOWN } from "../../types";
import { DayOfWeek, setDayOfWeekInHardhatNode } from "../../helpers/evm";
import { expect } from "chai";
import hre from "hardhat";

describe.only("Stake - claimRewards", async () => {
  let own: OwnContract;
  let stake: StakeContract;
  let signers: Signers;
  let veOwn: VeOWN;
  let alice: Signers[0];

  const dailyRewardAmount = parseEther("5");
  const weeks = 5;
  const duration = BigInt(7 * weeks);

  beforeEach(async () => {
    ({ stake, own, veOwn, signers } = await ownTestingAPI());
    alice = signers[1];
    await stake.write.setDailyRewardAmount([dailyRewardAmount]);

    await stake.write.startStakingNextWeek();

    const ownBalance = await own.read.balanceOf([signers[0].account.address]);

    await own.write.transfer([stake.address, parseEther("1000")]);

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

  it("Should pull funds over from the Sablier contract if there isn't enough funds in the contract for rewards", async () => {});

  it("Should claim rewards in the first week of staking", async () => {
    // Skip to start of staking
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await setDayOfWeekInHardhatNode(DayOfWeek.Wednesday);

    const boostMultiplier = await stake.read.getCurrentBoostMultiplier();
    const dailyRewardAmount = await stake.read.dailyRewardAmount();

    const amount = parseEther("50");

    await stake.write.stake([amount, duration]);

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    const rewardsPerDay = (dailyRewardAmount * boostMultiplier) / BigInt(1e18);

    await expect(
      stake.write.claimRewards([[BigInt(0)]]),
    ).to.changeTokenBalances(
      own,
      [signers[0].account],
      // Staked for 2 days
      [rewardsPerDay * BigInt(2)],
    );

    // TODO: Expect that the lastDayRewardsClaimed is updated

    // TODO: Emit event
  });

  it("Should claim rewards for an entire week", async () => {
    // Skip to start of staking
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await setDayOfWeekInHardhatNode(DayOfWeek.Friday);

    const amount = parseEther("50");

    await stake.write.stake([amount, duration]);

    // Skip to following saturday, so run this twice
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    const boostMultiplier = await stake.read.getCurrentBoostMultiplier();

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    const rewardsPerDay = (dailyRewardAmount * boostMultiplier) / BigInt(1e18);

    await expect(
      stake.write.claimRewards([[BigInt(0)]]),
    ).to.changeTokenBalances(
      own,
      [signers[0].account],
      // Staked for 7 days
      [rewardsPerDay * BigInt(7)],
    );
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

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await expect(
      stake.write.claimRewards([[BigInt(0)]]),
    ).to.changeTokenBalances(
      own,
      [signers[0].account],
      // Staked for 7 days
      [firstWeekRewards + secondWeekRewards],
    );
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

    await expect(
      stake.write.claimRewards([[BigInt(0)]]),
    ).to.changeTokenBalances(
      own,
      [signers[0].account],
      // Staked for 7 days
      [firstWeekRewards + secondWeekRewards],
    );
  });

  it("Should increase the rewards for the user when the daily reward amount is increased", async () => {});

  it("Should claim rewards for the 5 weeks the stake is active", async () => {
    // Skip to start of staking
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await setDayOfWeekInHardhatNode(DayOfWeek.Friday);

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

    await expect(
      stake.write.claimRewards([[BigInt(0)]]),
    ).to.changeTokenBalances(own, [signers[0].account], [rewards]);
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

      await expect(
        stake.write.claimRewards([[BigInt(0)]]),
      ).to.changeTokenBalances(own, [signers[0].account], [rewardsForDeployer]);

      const rewardsForAlice = rewardsForFirstHalfOfWeek / BigInt(2);

      await expect(
        stake_alice.write.claimRewards([[BigInt(1)]]),
      ).to.changeTokenBalances(own, [alice.account], [rewardsForAlice]);
    });

    it("Should increase the rewards for a user, when a another users stake ends", async () => {});
  });

  describe("Multiple users", async () => {
    // 5 users or something, different durations
    it("Should distribute rewards to users based on their stake", async () => {});
  });
});
