import { Signers, StakeContract } from "../../types";
import { ownTestingAPI } from "../../helpers/testing-api";
import { expect } from "chai";

describe("Stake - startStakingNextWeek", async () => {
  let stake: StakeContract;
  let signers: Signers;

  beforeEach(async () => {
    ({ stake, signers } = await ownTestingAPI());
  });

  it("Should revert if the daily reward amount isn't set", async () => {
    await expect(
      stake.write.startStakingNextWeek(),
    ).to.be.revertedWithCustomError(
      stake,
      "CannotStartStakingWithoutDailyRewardSet",
    );
  });

  it("Should revert if calling from an account that isn't the owner", async () => {
    await expect(
      stake.write.startStakingNextWeek({ account: signers[1].account }),
    ).to.be.revertedWithCustomError(stake, "CallerIsNotTheAdmin");
  });

  it("Should revert if the staking has already been setup", async () => {
    await stake.write.setDailyRewardAmount([BigInt(1)]);
    await stake.write.startStakingNextWeek();

    await expect(
      stake.write.startStakingNextWeek(),
    ).to.be.revertedWithCustomError(stake, "StakingAlreadyStarted");
  });

  it("Should write the correct storage variables", async () => {
    await stake.write.setDailyRewardAmount([BigInt(1)]);
    await stake.write.startStakingNextWeek();

    const currentWeek = await stake.read.getCurrentWeek();
    expect(await stake.read.lastRewardValuesWeeklyCachedWeek()).to.equal(
      currentWeek,
    );
    expect(await stake.read.stakingStartWeek()).to.equal(currentWeek);

    const [rewardPerToken, validVeOwn, dailyRewardAmount] =
      await stake.read.rewardValuesWeeklyCache([currentWeek]);

    expect({ rewardPerToken, validVeOwn, dailyRewardAmount }).to.deep.equal({
      rewardPerToken: BigInt(0),
      validVeOwn: BigInt(0),
      dailyRewardAmount: BigInt(1),
    });
  });
});
