import { expect } from "chai";
import {
  MockUSDTContract,
  OwnContract,
  PresaleContract,
  Signers,
} from "../../types";
import { getContractInstances } from "../../helpers/testing-api";
import { getAddress, parseEther } from "viem";
import { getCurrentBlockTimestamp, increaseTime } from "../../helpers/evm";

describe("Presale - purchasePresaleTokens", async () => {
  let presale: PresaleContract;
  let own: OwnContract;
  let mockUSDT: MockUSDTContract;
  let signers: Signers;

  beforeEach(async () => {
    ({ presale, own, mockUSDT, signers } = await getContractInstances());

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
          claimTokensTimestamp: BigInt(0),
        },
      ],
    ]);
  });

  it("Should revert when the presale hasn't started", async () => {
    await expect(
      presale.write.purchasePresaleTokens([
        BigInt(1000),
        signers[0].account.address,
      ])
    ).to.be.revertedWithCustomError(presale, "PresaleHasNotStarted");
  });

  describe("starting presale round", async () => {
    beforeEach(async () => {
      const currentTime = await getCurrentBlockTimestamp();
      await presale.write.setPresaleStartTime([BigInt(currentTime + 10)]);
      await increaseTime(10);
    });

    it("Should revert if all presale rounds have ended", async () => {
      await increaseTime(60);

      await expect(
        presale.write.purchasePresaleTokens([
          BigInt(1),
          signers[0].account.address,
        ])
      ).to.be.revertedWithCustomError(presale, "AllPresaleRoundsHaveEnded");
    });

    it("Should revert if the amount of tokens requested is larger than the allocation", async () => {
      await expect(
        presale.write.purchasePresaleTokens([
          BigInt(1001),
          signers[0].account.address,
        ])
      )
        .to.be.revertedWithCustomError(
          presale,
          "InsufficientBalanceInPresaleRoundForSale"
        )
        .withArgs(BigInt(1000), BigInt(1001));
    });

    it("Should purchase the tokens correctly", async () => {
      const purchaseAmount = BigInt(1000);
      const checksumAddress = getAddress(signers[0].account.address);

      const tx = presale.write.purchasePresaleTokens([
        purchaseAmount,
        signers[0].account.address,
      ]);
      await expect(tx)
        .to.emit(presale, "PresaleTokensPurchased")
        .withArgs(checksumAddress, 0, purchaseAmount, parseEther("1"));

      await expect(tx).to.changeTokenBalance(
        mockUSDT,
        presale.address,
        purchaseAmount
      );

      const [, , presaleRound] =
        await presale.read.getCurrentPresaleRoundDetails();

      expect(presaleRound.sales).to.equal(purchaseAmount);
      expect(await presale.read.totalSales()).to.equal(purchaseAmount);

      const usersPresalePurchases = await presale.read.getUsersPresalePurchases(
        [signers[0].account.address]
      );

      expect(usersPresalePurchases.length).to.equal(1);
      const { roundId, ownAmount, usdtAmount, receiver } =
        usersPresalePurchases[0];

      expect({ roundId, ownAmount, usdtAmount, receiver }).to.deep.equal({
        roundId: BigInt(0),
        ownAmount: purchaseAmount,
        usdtAmount: purchaseAmount,
        receiver: checksumAddress,
      });
    });
  });
});
