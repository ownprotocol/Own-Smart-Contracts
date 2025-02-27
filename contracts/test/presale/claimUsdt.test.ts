import hre from "hardhat";
import { expect } from "chai";
import {
  MockUSDTContract,
  OwnContract,
  PresaleContract,
  Signers,
} from "../../types";
import { ownTestingAPI } from "../../helpers/testing-api";
import { getAddress, parseEther } from "viem";

describe("Presale - claimUsdt", async () => {
  let presale: PresaleContract;
  let own: OwnContract;
  let mockUSDT: MockUSDTContract;
  let signers: Signers;

  let presaleNonOwner: PresaleContract;

  const amount = parseEther("100");

  beforeEach(async () => {
    ({ presale, own, mockUSDT, signers } = await ownTestingAPI());

    presaleNonOwner = await hre.viem.getContractAt("Presale", presale.address, {
      client: { wallet: signers[1] },
    });

    await mockUSDT.write.mint([presale.address, amount]);
  });

  it("Should revert if the caller is not the owner", async () => {
    await expect(
      presaleNonOwner.write.claimUSDT(),
    ).to.be.revertedWithCustomError(presale, "OwnableUnauthorizedAccount");
  });

  it("Should transfer the USDT to the owner", async () => {
    await expect(presale.write.claimUSDT()).to.changeTokenBalances(
      mockUSDT,
      [presale.address, signers[0].account.address],
      [-amount, amount],
    );
  });
});
