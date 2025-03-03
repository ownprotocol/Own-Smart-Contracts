import { parseEther } from "viem";
import { ownTestingAPI } from "../../helpers/testing-api";
import { OwnContract, StakeContract, Signers, VeOWN } from "../../types";
import { expect } from "chai";

describe("Stake - boost", async () => {
  let own: OwnContract;
  let stake: StakeContract;
  let signers: Signers;
  let veOwn: VeOWN;
  let alice: Signers[0];

  const dailyRewardAmount = parseEther("5");
  const weeks = 5;
  const duration = BigInt(7 * weeks);

  beforeEach(async () => {
    ({ stake, own, veOwn, signers } = await ownTestingAPI());
    // alice = signers[1];
    // await stake.write.setDailyRewardAmount([dailyRewardAmount]);
    //
    // await stake.write.startStakingNextWeek();
    // await setDayOfWeekInHardhatNode(DayOfWeek.Friday);
    //
    // const ownBalance = await own.read.balanceOf([signers[0].account.address]);
    //
    // await own.write.transfer([stake.address, parseEther("1000")]);
    //
    // await own.write.approve([stake.address, ownBalance]);
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
    const boostMultiplier = await stake.read.getBoostMultiplier([BigInt(0)]);

    expect(boostMultiplier).to.equal(parseEther("10"));
  });

  it("Should return 5x for the second week", async () => {
    const boostMultiplier = await stake.read.getBoostMultiplier([BigInt(1)]);

    expect(boostMultiplier).to.equal(parseEther("5"));
  });

  it("Should return 3x for the fifth week", async () => {
    const boostMultiplier = await stake.read.getBoostMultiplier([BigInt(4)]);

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

    const boostMultiplier = await stake.read.getBoostMultiplier([BigInt(0)]);

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

    const boostMultiplier = await stake.read.getBoostMultiplier([BigInt(2)]);

    expect(boostMultiplier).to.equal(parseEther("20"));

    const boostMultiplier2 = await stake.read.getBoostMultiplier([BigInt(3)]);

    expect(boostMultiplier2).to.equal(parseEther("5"));
  });

  it("Should return no boost after the 12th week", async () => {
    const boostMultiplier = await stake.read.getBoostMultiplier([BigInt(12)]);

    expect(boostMultiplier).to.equal(parseEther("1"));
  });
});
