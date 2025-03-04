import { expect } from "chai";
import { parseEther } from "viem";
import { ownTestingAPI } from "../../helpers/testing-api";
import { OwnContract, StakeContract, Signers, VeOWN } from "../../types";
import {
  DayOfWeek,
  getCurrentDay,
  setDayOfWeekInHardhatNode,
} from "../../helpers/evm";

describe("Stake - stake", async () => {
  let own: OwnContract;
  let stake: StakeContract;
  let signers: Signers;
  let veOwn: VeOWN;

  beforeEach(async () => {
    ({ stake, own, veOwn, signers } = await ownTestingAPI());
  });

  it("Should revert if trying to stake for 0 weeks", async () => {
    await expect(
      stake.write.stake([BigInt(1), BigInt(0)]),
    ).to.be.revertedWithCustomError(stake, "InvalidLockPeriod");
  });

  it("Should revert if trying to stake for more than the maximum allowed weeks", async () => {
    const maximumLockDays = await stake.read.maximumLockDays();

    await expect(
      stake.write.stake([BigInt(1), maximumLockDays + BigInt(1)]),
    ).to.be.revertedWithCustomError(stake, "InvalidLockPeriod");
  });

  it("Should revert if trying to stake 0 tokens", async () => {
    await expect(
      stake.write.stake([BigInt(0), BigInt(7)]),
    ).to.be.revertedWithCustomError(stake, "CannotStakeZeroAmount");
  });

  it("Should revert if staking hasn't started", async () => {
    await expect(
      stake.write.stake([BigInt(1), BigInt(7)]),
    ).to.be.revertedWithCustomError(stake, "StakingNotStarted");
  });

  it("Should set maximum lock days to 52 weeks and minimum lock days to 1 week", async () => {
    expect(await stake.read.maximumLockDays()).to.equal(BigInt(7 * 52));
    expect(await stake.read.minimumLockDays()).to.equal(BigInt(7));
  });

  describe("When staking has started", async () => {
    beforeEach(async () => {
      await stake.write.setDailyRewardAmount([parseEther("5")]);
      await stake.write.startStakingNextWeek();
      await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    });

    it("Should move own tokens from the caller to the contract and mint veOwn tokens", async () => {
      const amount = parseEther("1000");
      await own.write.approve([stake.address, amount]);
      const stakeFor5Weeks = BigInt(7 * 5);
      const stakeTx = stake.write.stake([amount, stakeFor5Weeks]);

      await expect(stakeTx).to.changeTokenBalances(
        own,
        [signers[0].account.address, stake.address],
        [-amount, amount],
      );

      await expect(stakeTx).to.changeTokenBalances(
        veOwn,
        [signers[0].account.address],
        [BigInt(5) * amount],
      );
    });

    it("Should set all the storage variables correctly", async () => {
      const amount = parseEther("1000");
      await own.write.approve([stake.address, amount]);
      await stake.write.stake([amount, BigInt(7)]);

      const currentDay = Number(await stake.read.getCurrentDay());
      const currentWeek = await stake.read.getCurrentWeek();
      const stakeStartDay = currentDay + 1;
      const stakeFinalDay = stakeStartDay + 7 - 1;

      const address = signers[0].account.address;

      const userPositions = await stake.read.getUsersPositions([address]);
      expect(userPositions.length).to.equal(1);
      expect(userPositions).to.deep.equal([
        {
          owner: address,
          ownAmount: amount,
          veOwnAmount: amount,
          startDay: stakeStartDay,
          finalDay: stakeFinalDay,
          lastWeekRewardsClaimed: currentWeek,
        },
      ]);

      expect(await stake.read.totalStaked()).to.equal(amount);

      expect(await stake.read.totalPositions()).to.equal(1);
      expect(
        await stake.read.validVeOwnAdditionsInDay([BigInt(stakeStartDay)]),
      ).to.equal(amount);
      expect(
        await stake.read.validVeOwnSubtractionsInDay([
          BigInt(stakeFinalDay + 1),
        ]),
      ).to.equal(amount);
    });

    it("Should mint veOwn tokens at 52x multiplier when staking for 1 year", async () => {
      const amount = parseEther("1000");
      await own.write.approve([stake.address, amount]);
      const numWeeks = 52;
      const stakeFor1Year = BigInt(7 * numWeeks);
      const stakeTx = stake.write.stake([amount, stakeFor1Year]);

      await expect(stakeTx).to.changeTokenBalances(
        veOwn,
        [signers[0].account.address],
        [BigInt(numWeeks) * amount],
      );
    });

    it("Should update the weekly rewards values cache", async () => {});

    it("Should emit the Staked event", async () => {});
  });
});
