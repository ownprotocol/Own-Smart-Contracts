import { expect } from "chai";
import { OwnContract, PresaleContract, Signers } from "../../types";
import { getContractInstances } from "../../helpers/testing-api";
import { getCurrentBlockTimestamp, increaseTime } from "../../helpers/evm";

describe("Presale - getCurrentPresaleRoundDetails", async () => {
  let presale: PresaleContract;
  let own: OwnContract;
  let signers: Signers;

  const firstPresaleRoundDuration = BigInt(50);
  const secondPresaleRoundDuration = BigInt(100);
  const startTimeOffset = 5;

  beforeEach(async () => {
    ({ presale, own, signers } = await getContractInstances());

    await own.write.transfer([presale.address, BigInt(10000)]);

    const currentTime = await getCurrentBlockTimestamp();

    await presale.write.addPresaleRounds([
      [
        {
          duration: firstPresaleRoundDuration,
          price: BigInt(1),
          allocation: BigInt(1000),
          sales: BigInt(0),
          claimTokensTimestamp: BigInt(0),
        },
        {
          duration: secondPresaleRoundDuration,
          price: BigInt(2),
          allocation: BigInt(2000),
          sales: BigInt(0),
          claimTokensTimestamp: BigInt(0),
        },
      ],
    ]);

    await presale.write.setPresaleStartTime([
      BigInt(currentTime + startTimeOffset),
    ]);
  });

  it("Should return no presale round details if presale has not started", async () => {
    const [
      hasPresaleStarted,
      hasRoundsInProgress,
      presaleRoundDetails,
      roundId,
    ] = await presale.read.getCurrentPresaleRoundDetails();

    expect(hasPresaleStarted).to.be.false;
    expect(hasRoundsInProgress).to.be.false;
    expect(roundId).to.equal(BigInt(0));
    expect(presaleRoundDetails.duration).to.equal(BigInt(0));
    expect(presaleRoundDetails.price).to.equal(BigInt(0));
    expect(presaleRoundDetails.allocation).to.equal(BigInt(0));
  });

  it("Should return the correct presale round details for the first presale round", async () => {
    await increaseTime(Number(startTimeOffset));

    const [
      hasPresaleStarted,
      hasRoundsInProgress,
      presaleRoundDetails,
      roundId,
    ] = await presale.read.getCurrentPresaleRoundDetails();

    expect(hasPresaleStarted).to.be.true;
    expect(hasRoundsInProgress).to.be.true;
    expect(roundId).to.equal(BigInt(0));
    expect(presaleRoundDetails.duration).to.equal(firstPresaleRoundDuration);
    expect(presaleRoundDetails.price).to.equal(BigInt(1));
    expect(presaleRoundDetails.allocation).to.equal(BigInt(1000));
    expect(presaleRoundDetails.sales).to.equal(BigInt(0));
  });

  it("Should return the correct presale round details for the second presale round", async () => {
    await increaseTime(Number(firstPresaleRoundDuration) + 10);

    const [
      hasPresaleStarted,
      hasRoundsInProgress,
      presaleRoundDetails,
      roundId,
    ] = await presale.read.getCurrentPresaleRoundDetails();

    expect(hasPresaleStarted).to.be.true;
    expect(hasRoundsInProgress).to.be.true;
    expect(roundId).to.equal(BigInt(1));
    expect(presaleRoundDetails.duration).to.equal(secondPresaleRoundDuration);
    expect(presaleRoundDetails.price).to.equal(BigInt(2));
    expect(presaleRoundDetails.allocation).to.equal(BigInt(2000));
    expect(presaleRoundDetails.sales).to.equal(BigInt(0));
  });

  it("Should return empty values if there are no presale rounds", async () => {
    await increaseTime(
      Number(firstPresaleRoundDuration + secondPresaleRoundDuration) + 10
    );

    const [
      hasPresaleStarted,
      hasRoundsInProgress,
      presaleRoundDetails,
      roundId,
    ] = await presale.read.getCurrentPresaleRoundDetails();

    expect(hasPresaleStarted).to.be.true;
    expect(hasRoundsInProgress).to.be.false;
    expect(roundId).to.equal(BigInt(0));
    expect(presaleRoundDetails.duration).to.equal(BigInt(0));
    expect(presaleRoundDetails.price).to.equal(BigInt(0));
    expect(presaleRoundDetails.allocation).to.equal(BigInt(0));
  });
});
