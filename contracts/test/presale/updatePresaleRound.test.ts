import { expect } from "chai";
import { OwnContract, PresaleContract, Signers } from "../../types";
import { getContractInstances } from "../../helpers/testing-api";
import hre from "hardhat";
import { getCurrentBlockTimestamp } from "../../helpers/evm";

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

  beforeEach(async () => {
    ({ presale, own, signers } = await getContractInstances());

    presaleNonOwner = await hre.viem.getContractAt("Presale", presale.address, {
      client: { wallet: signers[1] },
    });

    const currentTime = await getCurrentBlockTimestamp();

    await presale.write.setPresaleStartTime([BigInt(currentTime + 5)]);

    await own.write.transfer([presale.address, ALLOCATION]);

    await presale.write.addPresaleRounds([
      [
        {
          duration: BigInt(50),
          price: BigInt(1),
          allocation: ALLOCATION / BigInt(2),
          sales: BigInt(0),
        },
        {
          duration: BigInt(50),
          price: BigInt(1),
          allocation: ALLOCATION / BigInt(2),
          sales: BigInt(0),
        },
      ],
    ]);
  });

  updateMethods.forEach(
    ({ eventName, methodName, zeroValueErrorName, fieldNameIndex }) => {
      describe(methodName, async () => {
        it("Should revert if the caller is not the owner", async () => {
          await expect(
            presaleNonOwner.write.updatePresaleRoundPrice([
              BigInt(1),
              BigInt(1),
            ]),
          ).to.be.revertedWithCustomError(
            presale,
            "OwnableUnauthorizedAccount",
          );
        });

        it("Should revert when trying to update a presale round in progress", async () => {
          await expect(
            presale.write[methodName]([BigInt(0), BigInt(1)]),
          ).to.be.revertedWithCustomError(
            presale,
            "CannotUpdatePresaleRoundThatHasEndedOrInProgress",
          );
        });

        it("Should revert if the presale round index is out of bounds", async () => {
          await expect(
            presale.write[methodName]([BigInt(2), BigInt(1)]),
          ).to.be.revertedWithCustomError(
            presale,
            "PresaleRoundIndexOutOfBounds",
          );
        });

        it("Should revert when setting the value to 0", async () => {
          await expect(
            presale.write[methodName]([BigInt(1), BigInt(0)]),
          ).to.be.revertedWithCustomError(presale, zeroValueErrorName);
        });

        it("Should revert when there are no more presale rounds", async () => {
          await hre.ethers.provider.send("evm_increaseTime", [200]);

          await expect(
            presale.write[methodName]([BigInt(1), BigInt(1)]),
          ).to.be.revertedWithCustomError(presale, "AllPresaleRoundsHaveEnded");
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
    },
  );
});
