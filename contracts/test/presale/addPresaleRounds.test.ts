import { expect } from "chai";
import { OwnContract, PresaleContract } from "../../types";
import { ownTestingAPI } from "../../helpers/testing-api";

describe("Presale - addPresaleRounds", async () => {
  let presale: PresaleContract;
  let own: OwnContract;

  before(async () => {
    ({ presale, own } = await ownTestingAPI());
  });

  it("Should revert when the Presale contract doesn't have enough tokens for the presale rounds", async () => {
    await expect(
      presale.write.addPresaleRounds([
        [
          {
            duration: BigInt(1),
            price: BigInt(1),
            allocation: BigInt(1),
            sales: BigInt(0),
          },
        ],
      ]),
    ).to.be.revertedWithCustomError(
      presale,
      "InsufficientOwnBalanceForPresaleRounds",
    );
  });

  it("Should revert if passing a duration of 0 for a presale round", async () => {
    await expect(
      presale.write.addPresaleRounds([
        [
          {
            duration: BigInt(0),
            price: BigInt(1),
            allocation: BigInt(1),
            sales: BigInt(0),
          },
        ],
      ]),
    ).to.be.revertedWithCustomError(
      presale,
      "CannotSetPresaleRoundDurationToZero",
    );
  });

  it("Should revert if passing a price of 0 for a presale round", async () => {
    await expect(
      presale.write.addPresaleRounds([
        [
          {
            duration: BigInt(1),
            price: BigInt(0),
            allocation: BigInt(1),
            sales: BigInt(0),
          },
        ],
      ]),
    ).to.be.revertedWithCustomError(
      presale,
      "CannotSetPresaleRoundPriceToZero",
    );
  });

  it("Should revert if passing an allocation of 0 for a presale round", async () => {
    await expect(
      presale.write.addPresaleRounds([
        [
          {
            duration: BigInt(1),
            price: BigInt(1),
            allocation: BigInt(0),
            sales: BigInt(0),
          },
        ],
      ]),
    ).to.be.revertedWithCustomError(
      presale,
      "CannotSetPresaleRoundAllocationToZero",
    );
  });

  it("Should set the presale rounds correctly", async () => {
    await own.write.transfer([presale.address, BigInt(10)]);

    const presaleRounds = [
      {
        duration: BigInt(1),
        price: BigInt(1),
        allocation: BigInt(3),
        sales: BigInt(0),
      },
      {
        duration: BigInt(1),
        price: BigInt(1),
        allocation: BigInt(7),
        sales: BigInt(0),
      },
    ];

    await expect(presale.write.addPresaleRounds([presaleRounds])).to.emit(
      presale,
      "PresaleRoundsAdded",
    );

    const fetchedPresaleRounds = await presale.read.getAllPresaleRounds();

    expect(presaleRounds.length).to.equal(2);

    expect(presaleRounds).to.deep.equal(fetchedPresaleRounds);
  });

  it("Should revert when there are insufficient funds for additional presale rounds", async () => {
    await own.write.transfer([presale.address, BigInt(10)]);

    await presale.write.addPresaleRounds([
      [
        {
          duration: BigInt(1),
          price: BigInt(1),
          allocation: BigInt(3),
          sales: BigInt(0),
        },
        {
          duration: BigInt(1),
          price: BigInt(1),
          allocation: BigInt(7),
          sales: BigInt(0),
        },
      ],
    ]);

    await expect(
      presale.write.addPresaleRounds([
        [
          {
            duration: BigInt(1),
            price: BigInt(1),
            allocation: BigInt(10),
            sales: BigInt(0),
          },
        ],
      ]),
    ).to.be.revertedWithCustomError(
      presale,
      "InsufficientOwnBalanceForPresaleRounds",
    );
  });

  it("Should be able to add additional presale rounds", async () => {
    await own.write.transfer([presale.address, BigInt(20)]);

    await presale.write.addPresaleRounds([
      [
        {
          duration: BigInt(1),
          price: BigInt(1),
          allocation: BigInt(3),
          sales: BigInt(0),
        },
        {
          duration: BigInt(1),
          price: BigInt(1),
          allocation: BigInt(7),
          sales: BigInt(0),
        },
      ],
    ]);

    await expect(
      presale.write.addPresaleRounds([
        [
          {
            duration: BigInt(1),
            price: BigInt(1),
            allocation: BigInt(10),
            sales: BigInt(0),
          },
        ],
      ]),
    ).to.emit(presale, "PresaleRoundsAdded");
  });

  // TODO:
  it("Should be able to handle calculating the correct balance for presale rounds after a sale then when adding new presale rounds", async () => {
    await own.write.transfer([presale.address, BigInt(10)]);

    await presale.write.addPresaleRounds([
      [
        {
          duration: BigInt(1),
          price: BigInt(1),
          allocation: BigInt(3),
          sales: BigInt(0),
        },
        {
          duration: BigInt(1),
          price: BigInt(1),
          allocation: BigInt(7),
          sales: BigInt(0),
        },
      ],
    ]);

    // TODO: Purchase presale tokens
    // Transfer more tokens
    // Add new presale rounds - should succeed
  });
});
