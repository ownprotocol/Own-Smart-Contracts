import { expect } from "chai";
import { OwnContract, PresaleContract, Signers } from "../../types";
import { getContractInstances } from "../../helpers/testing-api";
import hre from "hardhat";
import { getCurrentBlockTimestamp, increaseTime } from "../../helpers/evm";

describe("Presale - update presale round claim timestamp", async () => {
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
  });

  it("Should revert if the caller is not the owner", async () => {
    await expect(
      presaleNonOwner.write.updatePresaleRoundClaimTimestamp([
        BigInt(1),
        BigInt(1),
      ])
    ).to.be.revertedWithCustomError(presale, "OwnableUnauthorizedAccount");
  });

  it("Should revert when trying to update a presale round in progress", async () => {
    const currentTime = await getCurrentBlockTimestamp();
    await presale.write.setPresaleStartTime([BigInt(currentTime + 5)]);
    await increaseTime(5);

    await expect(
      presale.write.updatePresaleRoundClaimTimestamp([BigInt(0), BigInt(1)])
    ).to.be.revertedWithCustomError(
      presale,
      "CannotUpdatePresaleRoundThatHasEndedOrInProgress"
    );
  });

  it("Should revert if the presale round index is out of bounds", async () => {
    await expect(
      presale.write.updatePresaleRoundClaimTimestamp([BigInt(2), BigInt(1)])
    ).to.be.revertedWithCustomError(presale, "PresaleRoundIndexOutOfBounds");
  });

  it("Should revert when there are no more presale rounds", async () => {
    const currentTime = await getCurrentBlockTimestamp();
    await presale.write.setPresaleStartTime([BigInt(currentTime + 5)]);

    await hre.ethers.provider.send("evm_increaseTime", [200]);

    await expect(
      presale.write.updatePresaleRoundClaimTimestamp([BigInt(1), BigInt(1)])
    ).to.be.revertedWithCustomError(presale, "AllPresaleRoundsHaveEnded");
  });

  it("Should update the presale round claim timestamp correctly", async () => {
    const startTime = BigInt(550);
    await presale.write.updatePresaleRoundClaimTimestamp([
      BigInt(1),
      startTime,
    ]);

    const round = await presale.read.presaleRounds([BigInt(1)]);

    expect(round[4]).to.equal(startTime);
  });

  it("Should revert when trying to set the claim timestamp to before a previous presale round completes", async () => {
    const currentTime = await getCurrentBlockTimestamp();
    await presale.write.setPresaleStartTime([BigInt(currentTime + 5)]);

    await expect(
      presale.write.updatePresaleRoundClaimTimestamp([
        BigInt(1),
        BigInt(currentTime + 50),
      ])
    ).to.be.revertedWithCustomError(
      presale,
      "CannotSetPresaleClaimTimestampToBeBeforeRoundEnd"
    );
  });
});
