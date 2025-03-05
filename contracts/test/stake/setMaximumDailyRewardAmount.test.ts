import { getContractInstances } from "../../helpers/testing-api";
import { StakeContract, Signers } from "../../types";
import { expect } from "chai";

describe("Stake - setMaximumDailyRewardAmount", async () => {
  let stake: StakeContract;
  let signers: Signers;

  beforeEach(async () => {
    ({ stake, signers } = await getContractInstances());
  });

  it("Should revert when setting the maximum daily reward amount to 0", async () => {
    await expect(
      stake.write.setMaximumDailyRewardAmount([BigInt(0)]),
    ).to.be.revertedWithCustomError(
      stake,
      "CannotSetMaximumDailyRewardAmountToZero",
    );
  });

  it("Should revert when trying to set the maximum daily reward amount from an unauthorised account", async () => {
    await expect(
      stake.write.setMaximumDailyRewardAmount([BigInt(1)], {
        account: signers[1].account,
      }),
    ).to.be.revertedWithCustomError(stake, "CallerIsNotTheAdmin");
  });

  it("Should update the maximum daily reward amount", async () => {
    await stake.write.setMaximumDailyRewardAmount([BigInt(1)]);

    const maximumDailyRewardAmount =
      await stake.read.maximumDailyRewardAmount();
    expect(maximumDailyRewardAmount).to.equal(BigInt(1));
  });
});
