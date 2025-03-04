import { expect } from "chai";
import hre from "hardhat";
import { parseEther } from "viem";
import { ownTestingAPI } from "../../helpers/testing-api";
import { Signers, VeOWN } from "../../types";
import { ZeroAddress } from "ethers";
import { MINTER_ROLE } from "../../constants/roles";

describe("veOwn", async () => {
  let veOwn: VeOWN;
  let signers: Signers;

  before(async () => {
    ({ veOwn, signers } = await ownTestingAPI());
  });

  it("Should allow someone with the minter role to mint tokens", async () => {
    await veOwn.write.grantRole([MINTER_ROLE, signers[0].account.address]);

    const receiverAddress = signers[0].account.address;
    const amount = parseEther("1000");
    await veOwn.write.mint([receiverAddress, amount]);

    const balance = await veOwn.read.balanceOf([receiverAddress]);

    expect(balance).to.equal(amount);
  });

  it("Should revert if trying to mint tokens from an account without the minter role", async () => {
    const receiverAddress = signers[0].account.address;
    const amount = parseEther("1000");

    const veOwnOther = await hre.viem.getContractAt("VeOWN", veOwn.address, {
      client: { wallet: signers[1] },
    });

    await expect(
      veOwnOther.write.mint([receiverAddress, amount]),
    ).to.be.revertedWithCustomError(veOwn, "AccessControlUnauthorizedAccount");
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
