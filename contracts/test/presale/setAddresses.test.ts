import { PresaleContract, Signers } from "../../types";
import { getContractInstances } from "../../helpers/testing-api";
import { expect } from "chai";
import { ZeroAddress } from "ethers";

describe("Presale - setAddresses", async () => {
  let presale: PresaleContract;
  let signers: Signers;

  beforeEach(async () => {
    ({ presale, signers } = await getContractInstances());
  });

  describe("Own", () => {
    it("Should revert when setting the Own address to 0", async () => {
      await expect(
        presale.write.setOwnAddress([ZeroAddress as `0x${string}`]),
      ).to.revertedWithCustomError(presale, "CannotSetAddressToZero");
    });

    it("Should revert when trying to set address from an account other than the admin", async () => {
      await expect(
        presale.write.setOwnAddress([signers[1].account.address], {
          account: signers[1].account,
        }),
      ).to.revertedWithCustomError(presale, "OwnableUnauthorizedAccount");
    });

    it("Should update the Own address", async () => {
      await presale.write.setOwnAddress([signers[1].account.address]);

      const ownAddress = (await presale.read.own()).toLowerCase();
      expect(ownAddress).to.equal(signers[1].account.address);
    });
  });

  describe("USDT", () => {
    it("Should revert when setting the USDT address to 0", async () => {
      await expect(
        presale.write.setUSDTAddress([ZeroAddress as `0x${string}`]),
      ).to.revertedWithCustomError(presale, "CannotSetAddressToZero");
    });

    it("Should revert when trying to set address from an account other than the admin", async () => {
      await expect(
        presale.write.setUSDTAddress([signers[1].account.address], {
          account: signers[1].account,
        }),
      ).to.revertedWithCustomError(presale, "OwnableUnauthorizedAccount");
    });

    it("Should update the USDT address", async () => {
      await presale.write.setUSDTAddress([signers[1].account.address]);

      const veOwnAddress = (await presale.read.usdt()).toLowerCase();
      expect(veOwnAddress).to.equal(signers[1].account.address);
    });
  });
});
