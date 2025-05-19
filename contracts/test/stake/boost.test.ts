import { parseEther } from "viem";
import { getContractInstances } from "../../helpers/testing-api";
import { Signers, StakeContract } from "../../types";
import { expect } from "chai";
import { DayOfWeek, setDayOfWeekInHardhatNode } from "../../helpers/evm";

describe("Stake - boost", async () => {
  let stake: StakeContract;
  let signers: Signers;

  beforeEach(async () => {
    ({ stake, signers } = await getContractInstances());

    await stake.write.setDailyRewardAmount([parseEther("5")]);
    await stake.write.startStakingNextWeek();
  });

  it("Should revert when passing a startWeek that is in the past", async () => {
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await expect(
      stake.write.addBoostDetails([
        [
          {
            startWeek: BigInt(0),
            durationInWeeks: BigInt(1),
            multiplier: parseEther("20"),
          },
        ],
      ])
    ).to.be.revertedWithCustomError(
      stake,
      "CannotSetBoostForCurrentOrPastWeek"
    );
  });

  it("Should revert when trying to set boost details for the current week", async () => {
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await expect(
      stake.write.addBoostDetails([
        [
          {
            startWeek: BigInt(1),
            durationInWeeks: BigInt(1),
            multiplier: parseEther("20"),
          },
        ],
      ])
    ).to.be.revertedWithCustomError(
      stake,
      "CannotSetBoostForCurrentOrPastWeek"
    );
  });

  it("Should revert when trying to set the boost details from a non-admin account", async () => {
    await expect(
      stake.write.addBoostDetails(
        [
          [
            {
              startWeek: BigInt(0),
              durationInWeeks: BigInt(1),
              multiplier: parseEther("20"),
            },
          ],
        ],
        { account: signers[1].account }
      )
    ).to.be.revertedWithCustomError(stake, "CallerIsNotTheAdmin");
  });

  it("Should revert when passing a _durationInWeeks that is 0", async () => {
    await expect(
      stake.write.addBoostDetails([
        [
          {
            startWeek: BigInt(1),
            durationInWeeks: BigInt(0),
            multiplier: parseEther("20"),
          },
        ],
      ])
    ).to.be.revertedWithCustomError(
      stake,
      "CannotSetDurationInWeeksForBoostToZero"
    );
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

  it("Should update the final boost week", async () => {
    await stake.write.addBoostDetails([
      [
        {
          startWeek: BigInt(15),
          durationInWeeks: BigInt(1),
          multiplier: parseEther("20"),
        },
      ],
    ]);

    expect(await stake.read.finalBoostWeek()).to.equal(15);
  });

  it("Should not revert when getting the current boost multiplier before staking has started", async () => {
    const boostMultiplier = await stake.read.getCurrentBoostMultiplier();

    expect(boostMultiplier).to.equal(0);
  });
});
