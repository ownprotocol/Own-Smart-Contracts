import { parseEther } from "viem";
import { ownTestingAPI } from "../../helpers/testing-api";
import { OwnContract, StakeContract, Signers, VeOWN } from "../../types";
import { expect } from "chai";

describe("Stake - boost", async () => {
  let stake: StakeContract;

  beforeEach(async () => {
    ({ stake } = await ownTestingAPI());
  });

  it("Should have the initial boost configuration", async () => {
    const boostDetails = await stake.read.getBoostDetails();

    expect(boostDetails).to.deep.equal([
      {
        startWeek: BigInt(0),
        durationInWeeks: BigInt(1),
        multiplier: parseEther("10"),
      },
      {
        startWeek: BigInt(1),
        durationInWeeks: BigInt(3),
        multiplier: parseEther("5"),
      },
      {
        startWeek: BigInt(4),
        durationInWeeks: BigInt(8),
        multiplier: parseEther("3"),
      },
    ]);
  });

  it("Should return 10x for the first week", async () => {
    const boostMultiplier =
      await stake.read.getBoostMultiplierForWeekSinceStart([BigInt(0)]);

    expect(boostMultiplier).to.equal(parseEther("10"));
  });

  it("Should return 5x for the second week", async () => {
    const boostMultiplier =
      await stake.read.getBoostMultiplierForWeekSinceStart([BigInt(1)]);

    expect(boostMultiplier).to.equal(parseEther("5"));
  });

  it("Should return 3x for the fifth week", async () => {
    const boostMultiplier =
      await stake.read.getBoostMultiplierForWeekSinceStart([BigInt(4)]);

    expect(boostMultiplier).to.equal(parseEther("3"));
  });

  it("Should override the boost multiplier for the first week", async () => {
    await stake.write.addBoostDetails([
      [
        {
          startWeek: BigInt(0),
          durationInWeeks: BigInt(1),
          multiplier: parseEther("20"),
        },
      ],
    ]);

    const boostMultiplier =
      await stake.read.getBoostMultiplierForWeekSinceStart([BigInt(0)]);

    expect(boostMultiplier).to.equal(parseEther("20"));
  });

  it("Should override the boost multiplier for the 3rd week, but not the 4th", async () => {
    await stake.write.addBoostDetails([
      [
        {
          startWeek: BigInt(2),
          durationInWeeks: BigInt(1),
          multiplier: parseEther("20"),
        },
      ],
    ]);

    const boostMultiplier =
      await stake.read.getBoostMultiplierForWeekSinceStart([BigInt(2)]);

    expect(boostMultiplier).to.equal(parseEther("20"));

    const boostMultiplier2 =
      await stake.read.getBoostMultiplierForWeekSinceStart([BigInt(3)]);

    expect(boostMultiplier2).to.equal(parseEther("5"));
  });

  it("Should return no boost after the 12th week", async () => {
    const boostMultiplier =
      await stake.read.getBoostMultiplierForWeekSinceStart([BigInt(12)]);

    expect(boostMultiplier).to.equal(parseEther("1"));
  });
});
