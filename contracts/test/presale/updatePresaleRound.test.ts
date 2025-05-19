import { expect } from "chai";
import { OwnContract, PresaleContract, Signers } from "../../types";
import { getContractInstances } from "../../helpers/testing-api";
import hre from "hardhat";
import { getCurrentBlockTimestamp, increaseTime } from "../../helpers/evm";

const updateMethods = [
  {
    eventName: "PresaleRoundDurationUpdated",
    methodName: "updatePresaleRoundDuration",
    zeroValueErrorName: "CannotSetPresaleRoundDurationToZero",
    fieldNameIndex: 0,
  },
  {
    eventName: "PresaleRoundPriceUpdated",
    methodName: "updatePresaleRoundPrice",
    zeroValueErrorName: "CannotSetPresaleRoundPriceToZero",
    fieldNameIndex: 1,
  },
  {
    eventName: "PresaleRoundAllocationUpdated",
    methodName: "updatePresaleRoundAllocation",
    zeroValueErrorName: "CannotSetPresaleRoundAllocationToZero",
    fieldNameIndex: 2,
  },
] as const;

describe("Presale - update presale round", async () => {
  let presale: PresaleContract;
  let own: OwnContract;
  let signers: Signers;

  let presaleNonOwner: PresaleContract;

  const ALLOCATION = BigInt(1000);
  const startTimeOffset = 50;

  beforeEach(async () => {
    ({ presale, own, signers } = await getContractInstances());

    presaleNonOwner = await hre.viem.getContractAt("Presale", presale.address, {
      client: { wallet: signers[1] },
    });

    const currentTime = await getCurrentBlockTimestamp();

    await own.write.transfer([presale.address, ALLOCATION]);

    await presale.write.addPresaleRounds([
      [
        {
          duration: BigInt(50),
          price: BigInt(1),
          allocation: ALLOCATION / BigInt(2),
          sales: BigInt(0),
          claimTokensTimestamp: BigInt(0),
        },
        {
          duration: BigInt(50),
          price: BigInt(1),
          allocation: ALLOCATION / BigInt(2),
          sales: BigInt(0),
          claimTokensTimestamp: BigInt(0),
        },
      ],
    ]);

    await presale.write.setPresaleStartTime([
      BigInt(currentTime + startTimeOffset),
    ]);
  });

  updateMethods.forEach(
    ({ eventName, methodName, zeroValueErrorName, fieldNameIndex }) => {
      describe(methodName, async () => {
        it("Should let you update the first round before the presale starts", async () => {
          const previousRound = await presale.read.presaleRounds([BigInt(0)]);
          const previousValue = previousRound[fieldNameIndex];

          const newValue = BigInt(10);
          await expect(presale.write[methodName]([BigInt(0), newValue]))
            .to.emit(presale, eventName)
            .withArgs(BigInt(0), newValue, previousValue);

          const round = await presale.read.presaleRounds([BigInt(0)]);

          expect(round[fieldNameIndex]).to.equal(newValue);
        });

        describe("after the presale has started", async () => {
          beforeEach(async () => {
            await increaseTime(Number(50));
          });

          it("Should revert if the caller is not the owner", async () => {
            await expect(
              presaleNonOwner.write[methodName]([BigInt(1), BigInt(1)])
            ).to.be.revertedWithCustomError(
              presale,
              "OwnableUnauthorizedAccount"
            );
          });

          it("Should revert when trying to update a presale round in progress", async () => {
            await expect(
              presale.write[methodName]([BigInt(0), BigInt(1)])
            ).to.be.revertedWithCustomError(
              presale,
              "CannotUpdatePresaleRoundThatHasEndedOrInProgress"
            );
          });

          it("Should revert if the presale round index is out of bounds", async () => {
            await expect(
              presale.write[methodName]([BigInt(2), BigInt(1)])
            ).to.be.revertedWithCustomError(
              presale,
              "PresaleRoundIndexOutOfBounds"
            );
          });

          it("Should revert when setting the value to 0", async () => {
            await expect(
              presale.write[methodName]([BigInt(1), BigInt(0)])
            ).to.be.revertedWithCustomError(presale, zeroValueErrorName);
          });

          it("Should revert when there are no more presale rounds", async () => {
            await hre.ethers.provider.send("evm_increaseTime", [200]);

            await expect(
              presale.write[methodName]([BigInt(1), BigInt(1)])
            ).to.be.revertedWithCustomError(
              presale,
              "AllPresaleRoundsHaveEnded"
            );
          });

          it("Should update the presale round correctly", async () => {
            const previousRound = await presale.read.presaleRounds([BigInt(1)]);
            const previousValue = previousRound[fieldNameIndex];

            const newValue = BigInt(10);
            await expect(presale.write[methodName]([BigInt(1), newValue]))
              .to.emit(presale, eventName)
              .withArgs(BigInt(1), newValue, previousValue);

            const round = await presale.read.presaleRounds([BigInt(1)]);

            expect(round[fieldNameIndex]).to.equal(newValue);
          });
        });
      });
    }
  );

  it("Should revert when setting the presale round allocation to a value greater than the balance of the contract", async () => {
    await expect(
      presale.write.updatePresaleRoundAllocation([BigInt(0), ALLOCATION])
    ).to.be.revertedWithCustomError(
      presale,
      "InsufficientOwnBalanceForPresaleRounds"
    );
  });
});
