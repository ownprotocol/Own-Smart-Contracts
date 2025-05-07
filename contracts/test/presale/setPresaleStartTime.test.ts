import { getCurrentBlockTimestamp, increaseTime } from "../../helpers/evm";
import { getContractInstances } from "../../helpers/testing-api";
import { PresaleContract, Signers } from "../../types";
import { expect } from "chai";

describe("Stake - setPresaleStartTime", async () => {
  let presale: PresaleContract;
  let signers: Signers;

  beforeEach(async () => {
    ({ presale, signers } = await getContractInstances());
  });

  it("Should revert when the caller is not the owner", async () => {
    await expect(
      presale.write.setPresaleStartTime([BigInt(0)], {
        account: signers[1].account,
      }),
    ).to.be.revertedWithCustomError(presale, "OwnableUnauthorizedAccount");
  });

  it("Should revert when trying to set a presale time in the past", async () => {
    const currentTime = await getCurrentBlockTimestamp();

    await expect(
      presale.write.setPresaleStartTime([BigInt(currentTime - 5)]),
    ).to.be.revertedWithCustomError(
      presale,
      "CannotSetPresaleStartTimeToPastTime",
    );
  });

  it("Should revert when the presale has started and the owner tries to set the presale time", async () => {
    const currentTime = await getCurrentBlockTimestamp();

    await presale.write.setPresaleStartTime([BigInt(currentTime + 5)]);

    await increaseTime(50);

    await expect(
      presale.write.setPresaleStartTime([BigInt(currentTime + 100)]),
    ).to.be.revertedWithCustomError(
      presale,
      "CannotSetPresaleStartTimeOncePresaleHasStarted",
    );
  });

  it("Should set the presale start time and emit an event", async () => {
    const currentTime = await getCurrentBlockTimestamp();

    const startTime = BigInt(currentTime + 5);
    const tx = await presale.write.setPresaleStartTime([startTime]);

    await expect(tx)
      .to.emit(presale, "PresaleStartTimeSet")
      .withArgs(startTime);
  });
});
