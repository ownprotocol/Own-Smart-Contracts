import { Signers, StakeContract } from "../../types";
import { getContractInstances } from "../../helpers/testing-api";
import { expect } from "chai";
import { ZeroAddress } from "ethers";

describe("Stake - setAddresses", async () => {
  let stake: StakeContract;
  let signers: Signers;

  beforeEach(async () => {
    ({ stake, signers } = await getContractInstances());
  });

  describe("Own", () => {
    it("Should revert when setting the Own address to 0", async () => {
      await expect(
        stake.write.setOwnAddress([ZeroAddress as `0x${string}`]),
      ).to.revertedWithCustomError(stake, "CannotSetAddressToZero");
    });

    it("Should revert when trying to set address from an account other than the admin", async () => {
      await expect(
        stake.write.setOwnAddress([signers[1].account.address], {
          account: signers[1].account,
        }),
      ).to.revertedWithCustomError(stake, "CallerIsNotTheAdmin");
    });

    it("Should update the Own address", async () => {
      await stake.write.setOwnAddress([signers[1].account.address]);

      const ownAddress = (await stake.read.ownToken()).toLowerCase();
      expect(ownAddress).to.equal(signers[1].account.address);
    });
  });

  describe("veOwn", () => {
    it("Should revert when setting the veOwn address to 0", async () => {
      await expect(
        stake.write.setVeOwnAddress([ZeroAddress as `0x${string}`]),
      ).to.revertedWithCustomError(stake, "CannotSetAddressToZero");
    });

    it("Should revert when trying to set address from an account other than the admin", async () => {
      await expect(
        stake.write.setVeOwnAddress([signers[1].account.address], {
          account: signers[1].account,
        }),
      ).to.revertedWithCustomError(stake, "CallerIsNotTheAdmin");
    });

    it("Should update the veOwn address", async () => {
      await stake.write.setVeOwnAddress([signers[1].account.address]);

      const veOwnAddress = (await stake.read.veOwn()).toLowerCase();
      expect(veOwnAddress).to.equal(signers[1].account.address);
    });
  });

  describe("sablierLockup", () => {
    it("Should revert when setting the sablierLockup address to 0", async () => {
      await expect(
        stake.write.setSablierLockupAddress([ZeroAddress as `0x${string}`]),
      ).to.revertedWithCustomError(stake, "CannotSetAddressToZero");
    });

    it("Should revert when trying to set address from an account other than the admin", async () => {
      await expect(
        stake.write.setSablierLockupAddress([signers[1].account.address], {
          account: signers[1].account,
        }),
      ).to.revertedWithCustomError(stake, "CallerIsNotTheAdmin");
    });

    it("Should update the sablierLockup address", async () => {
      await stake.write.setSablierLockupAddress([signers[1].account.address]);

      const sablierLockupAddress = (
        await stake.read.sablierLockup()
      ).toLowerCase();
      expect(sablierLockupAddress).to.equal(signers[1].account.address);
    });
  });
});
