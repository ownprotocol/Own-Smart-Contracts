import { expect } from "chai";
import {
  MockUSDTContract,
  OwnContract,
  PresaleContract,
  Signers,
} from "../../types";
import { getContractInstances } from "../../helpers/testing-api";
import { getCurrentBlockTimestamp, increaseTime } from "../../helpers/evm";
import { parseEther } from "ethers";

describe("Presale - addPresaleRounds", async () => {
  let presale: PresaleContract;
  let own: OwnContract;
  let signers: Signers;
  let mockUSDT: MockUSDTContract;

  beforeEach(async () => {
    ({ presale, own, signers, mockUSDT } = await getContractInstances());
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

  it("Should let you add a presale round, even if all the presale rounds have finished", async () => {
    await own.write.transfer([presale.address, BigInt(10)]);

    await presale.write.addPresaleRounds([
      [
        {
          duration: BigInt(5),
          price: BigInt(1),
          allocation: BigInt(3),
          sales: BigInt(0),
        },
      ],
    ]);
    await increaseTime(100);
    await presale.write.addPresaleRounds([
      [
        {
          duration: BigInt(200),
          price: BigInt(1),
          allocation: BigInt(3),
          sales: BigInt(0),
        },
      ],
    ]);
  });

  it("Should revert when trying to add a presale round from an unauthorized account", async () => {
    await expect(
      presale.write.addPresaleRounds(
        [
          [
            {
              duration: BigInt(1),
              price: BigInt(1),
              allocation: BigInt(3),
              sales: BigInt(0),
            },
          ],
        ],
        { account: signers[1].account },
      ),
    ).to.be.revertedWithCustomError(presale, "OwnableUnauthorizedAccount");
  });

  it("Should be able to handle calculating the correct balance for presale rounds after a sale then when adding new presale rounds", async () => {
    await own.write.transfer([presale.address, parseEther("3")]);

    await presale.write.addPresaleRounds([
      [
        {
          duration: BigInt(10),
          price: parseEther("1"),
          allocation: parseEther("3"),
          sales: BigInt(0),
        },
      ],
    ]);

    const currentTime = await getCurrentBlockTimestamp();

    await presale.write.setPresaleStartTime([BigInt(currentTime + 5)]);

    await increaseTime(5);

    await mockUSDT.write.approve([presale.address, parseEther("1000")], {
      account: signers[0].account,
    });
    await mockUSDT.write.mint([signers[0].account.address, parseEther("1000")]);
    await presale.write.purchasePresaleTokens([
      parseEther("3"),
      signers[0].account.address,
    ]);

    await expect(
      presale.write.addPresaleRounds([
        [
          {
            duration: BigInt(1),
            price: BigInt(1),
            allocation: parseEther("10"),
            sales: BigInt(0),
          },
        ],
      ]),
    ).to.revertedWithCustomError(
      presale,
      "InsufficientOwnBalanceForPresaleRounds",
    );

    await own.write.transfer([presale.address, parseEther("10")]);

    await expect(
      presale.write.addPresaleRounds([
        [
          {
            duration: BigInt(1),
            price: BigInt(1),
            allocation: parseEther("10"),
            sales: BigInt(0),
          },
        ],
      ]),
    ).to.emit(presale, "PresaleRoundsAdded");
  });
});
