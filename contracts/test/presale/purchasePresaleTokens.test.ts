import { expect } from "chai";
import {
  MockUSDTContract,
  OwnContract,
  PresaleContract,
  Signers,
} from "../../types";
import { getContractInstances } from "../../helpers/testing-api";
import { getAddress, parseEther, parseUnits } from "viem";
import { getCurrentBlockTimestamp, increaseTime } from "../../helpers/evm";

describe("Presale - purchasePresaleTokens", async () => {
  let presale: PresaleContract;
  let own: OwnContract;
  let mockUSDT: MockUSDTContract;
  let signers: Signers;

  beforeEach(async () => {
    ({ presale, own, mockUSDT, signers } = await getContractInstances());

    await own.write.transfer([presale.address, parseEther("100000")]);
    await mockUSDT.write.mint([
      signers[0].account.address,
      parseUnits("1000", 6),
    ]);
    await mockUSDT.write.approve([presale.address, parseUnits("1000", 6)]);

    await presale.write.addPresaleRounds([
      [
        {
          duration: BigInt(50),
          price: parseUnits("1", 6),
          allocation: parseEther("1"),
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
      ]),
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
        ]),
      ).to.be.revertedWithCustomError(presale, "AllPresaleRoundsHaveEnded");
    });

    it("Should revert if the amount of tokens requested is larger than the allocation", async () => {
      await expect(
        presale.write.purchasePresaleTokens([
          parseUnits("2", 6), // 2 USDT, which is more than the allocation of 1 USDT
          signers[0].account.address,
        ]),
      )
        .to.be.revertedWithCustomError(
          presale,
          "InsufficientBalanceInPresaleRoundForSale",
        )
        .withArgs(parseEther("1"), parseEther("2"));
    });

    it("Should purchase the tokens correctly", async () => {
      const purchaseAmount = BigInt(1000);
      const ownPurchased = parseUnits("1", 15);
      const checksumAddress = getAddress(signers[0].account.address);

      const tx = presale.write.purchasePresaleTokens([
        purchaseAmount,
        signers[0].account.address,
      ]);
      await expect(tx)
        .to.emit(presale, "PresaleTokensPurchased")
        .withArgs(checksumAddress, 0, ownPurchased, parseUnits("1", 6));

      await expect(tx).to.changeTokenBalance(
        mockUSDT,
        presale.address,
        purchaseAmount,
      );

      const [, , presaleRound] =
        await presale.read.getCurrentPresaleRoundDetails();

      expect(presaleRound.sales).to.equal(ownPurchased);
      expect(await presale.read.totalSales()).to.equal(ownPurchased);

      const usersPresalePurchases = await presale.read.getUsersPresalePurchases(
        [signers[0].account.address],
      );

      expect(usersPresalePurchases.length).to.equal(1);
      const { roundId, ownAmount, usdtAmount, receiver } =
        usersPresalePurchases[0];

      expect({ roundId, ownAmount, usdtAmount, receiver }).to.deep.equal({
        roundId: BigInt(0),
        ownAmount: ownPurchased,
        usdtAmount: purchaseAmount,
        receiver: checksumAddress,
      });
    });
  });
});
