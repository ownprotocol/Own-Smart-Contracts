import { Signers, StakeContract } from "../../types";
import { getContractInstances } from "../../helpers/testing-api";
import { expect } from "chai";

describe("Stake - setSablierStreamId", async () => {
  let stake: StakeContract;
  let signers: Signers;

  beforeEach(async () => {
    ({ stake, signers } = await getContractInstances());
  });

  it("Should revert if calling from an account that isn't the owner", async () => {
    await expect(
      stake.write.setSablierStreamId([BigInt(1)], {
        account: signers[1].account,
      }),
    ).to.be.revertedWithCustomError(stake, "CallerIsNotTheAdmin");
  });

  it("Should update the stream id", async () => {
    await stake.write.setSablierStreamId([BigInt(1)]);

    const streamId = await stake.read.sablierStreamId();
    expect(streamId).to.equal(BigInt(1));
  });
});
