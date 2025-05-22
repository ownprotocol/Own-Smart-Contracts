import { expect } from "chai";
import { getContractInstances } from "../../helpers/testing-api";
import { Signers, VeOwn } from "../../types";
import { ZeroAddress } from "ethers";

describe("veOwn", async () => {
  let veOwn: VeOwn;
  let signers: Signers;

  before(async () => {
    ({ veOwn, signers } = await getContractInstances());
  });

  it("Should revert when trying to transfer", async () => {
    await expect(
      veOwn.write.transfer([ZeroAddress, BigInt(1)]),
    ).to.be.revertedWithCustomError(veOwn, "TransferDisabled");
  });

  it("Should revert when trying to transferFrom", async () => {
    await expect(
      veOwn.write.transferFrom([ZeroAddress, ZeroAddress, BigInt(1)]),
    ).to.be.revertedWithCustomError(veOwn, "TransferFromDisabled");
  });
});
