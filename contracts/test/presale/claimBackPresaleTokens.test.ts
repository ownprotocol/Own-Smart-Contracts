import { expect } from "chai";
import {
  MockUSDTContract,
  OwnContract,
  PresaleContract,
  Signers,
} from "../../types";
import { getContractInstances } from "../../helpers/testing-api";
import { parseEther } from "viem";
import { getCurrentBlockTimestamp, increaseTime } from "../../helpers/evm";

describe("Presale - claimBackPresaleTokens", async () => {
  let presale: PresaleContract;
  let own: OwnContract;
  let mockUSDT: MockUSDTContract;
  let signers: Signers;

  const purchaseAmount = 1000n;
  const presaleAmount = 1000000n;

  beforeEach(async () => {
    ({ presale, own, mockUSDT, signers } = await getContractInstances());

    await own.write.transfer([presale.address, presaleAmount]);
    await mockUSDT.write.mint([signers[0].account.address, parseEther("1000")]);
    await mockUSDT.write.approve([presale.address, parseEther("1000")]);

    await presale.write.addPresaleRounds([
      [
        {
          duration: BigInt(50),
          price: parseEther("1"),
          allocation: BigInt(1000),
          sales: BigInt(0),
          claimTokensTimestamp: BigInt(0),
        },
      ],
    ]);

    const currentTime = await getCurrentBlockTimestamp();
    await presale.write.setPresaleStartTime([BigInt(currentTime + 10)]);
    await increaseTime(10);

    await presale.write.purchasePresaleTokens([
      purchaseAmount,
      signers[0].account.address,
    ]);
  });

  it("Should revert when trying to claim back presale tokens while the presale is still ongoing", async () => {
    await expect(
      presale.write.claimBackPresaleTokens()
    ).to.be.revertedWithCustomError(
      presale,
      "CannotClaimBackPresaleTokensWhilePresaleIsInProgress"
    );
  });

  it("Should revert when trying to claim back presale tokens from an account that isn't the owner", async () => {
    await expect(
      presale.write.claimBackPresaleTokens({
        account: signers[1].account,
      })
    ).to.be.revertedWithCustomError(presale, "OwnableUnauthorizedAccount");
  });

  it("Should transfer the owner the presale tokens once the rounds have finished", async () => {
    await increaseTime(50);

    await expect(presale.write.claimBackPresaleTokens()).to.changeTokenBalances(
      own,
      [presale.address, signers[0].account.address],
      [-(presaleAmount - purchaseAmount), presaleAmount - purchaseAmount]
    );
  });
});
