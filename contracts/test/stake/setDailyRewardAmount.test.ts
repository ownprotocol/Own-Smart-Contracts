import { parseEther } from "viem";
import { ownTestingAPI } from "../../helpers/testing-api";
import { StakeContract, Signers } from "../../types";
import { expect } from "chai";

describe("Stake - setDailyRewardAmount", async () => {
  let stake: StakeContract;
  let signers: Signers;

  beforeEach(async () => {
    ({ stake, signers } = await ownTestingAPI());
  });

  it("Should revert if not called by the owner", async () => {
    await expect(
      stake.write.setDailyRewardAmount([parseEther("1")], {
        account: signers[1].account,
      }),
    ).to.be.revertedWithCustomError(stake, "CallerIsNotTheAdmin");
  });

  it("Should revert if the amount is 0", async () => {
    await expect(
      stake.write.setDailyRewardAmount([BigInt(0)]),
    ).to.be.revertedWithCustomError(stake, "CannotSetDailyRewardAmountToZero");
  });

  it("Should update the storage variables", async () => {
    await stake.write.setDailyRewardAmount([parseEther("1")]);

    const dailyRewardAmount = await stake.read.dailyRewardAmount();
    expect(dailyRewardAmount).to.equal(parseEther("1"));

    const currentDay = await stake.read.getCurrentDay();
    expect(await stake.read.dailyRewardValueHistory([currentDay])).to.equal(
      dailyRewardAmount,
    );
  });
});
