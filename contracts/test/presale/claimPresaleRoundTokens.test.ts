import { expect } from "chai";
import {
  MockUSDTContract,
  OwnContract,
  PresaleContract,
  Signers,
} from "../../types";
import { ownTestingAPI } from "../../helpers/testing-api";
import { parseEther } from "viem";
import { getCurrentBlockTimestamp, increaseTime } from "../../helpers/evm";

describe("Presale - purchasePresaleTokens", async () => {
  let presale: PresaleContract;
  let own: OwnContract;
  let mockUSDT: MockUSDTContract;
  let signers: Signers;

  beforeEach(async () => {
    ({ presale, own, mockUSDT, signers } = await ownTestingAPI());

    await own.write.transfer([presale.address, BigInt(1000000)]);
    await mockUSDT.write.mint([signers[0].account.address, parseEther("1000")]);
    await mockUSDT.write.approve([presale.address, parseEther("1000")]);

    await presale.write.addPresaleRounds([
      [
        {
          duration: BigInt(50),
          price: parseEther("1"),
          allocation: BigInt(1000),
          sales: BigInt(0),
        },
      ],
    ]);
    const currentTime = await getCurrentBlockTimestamp();
    await presale.write.setPresaleStartTime([BigInt(currentTime + 10)]);
    await increaseTime(10);
  });

  it("Should revert if there are no tokens to transfer", async () => {
    await presale.write.purchasePresaleTokens([
      BigInt(1000),
      signers[0].account.address,
    ]);

    await expect(
      presale.write.claimPresaleRoundTokens(),
    ).to.revertedWithCustomError(presale, "NoPresaleTokensToClaim");
  });

  it("Should transfer the tokens after the round has ended", async () => {
    await presale.write.purchasePresaleTokens([
      BigInt(1000),
      signers[0].account.address,
    ]);

    await increaseTime(50);

    await expect(
      presale.write.claimPresaleRoundTokens(),
    ).to.changeTokenBalances(
      own,
      [presale.address, signers[0].account.address],
      [-BigInt(1000), BigInt(1000)],
    );
  });

  it("Should transfer multiple rounds of tokens", async () => {
    await presale.write.addPresaleRounds([
      [
        {
          duration: BigInt(50),
          price: parseEther("1.5"),
          allocation: BigInt(1000),
          sales: BigInt(0),
        },
      ],
    ]);

    await presale.write.purchasePresaleTokens([
      BigInt(1000),
      signers[0].account.address,
    ]);

    await increaseTime(50);

    await presale.write.purchasePresaleTokens([
      BigInt(1000),
      signers[0].account.address,
    ]);

    await increaseTime(50);

    const totalTokens =
      BigInt(1000) + (BigInt(1000) * BigInt(1e18)) / BigInt(1.5e18);

    await expect(
      presale.write.claimPresaleRoundTokens(),
    ).to.changeTokenBalances(own, [signers[0].account.address], [totalTokens]);
  });
});
