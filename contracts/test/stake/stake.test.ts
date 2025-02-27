import { expect } from "chai";
import hre from "hardhat";
import { parseEther } from "viem";
import { ownTestingAPI } from "../../helpers/testing-api";
import { OwnContract, StakeContract, Signers, VeOWN } from "../../types";

describe.only("Stake - stake", async () => {
  let own: OwnContract;
  let stake: StakeContract;
  let signers: Signers;
  let veOwn: VeOWN;

  beforeEach(async () => {
    ({ stake, own, veOwn, signers } = await ownTestingAPI());
  });

  it("Should revert if trying to stake for 0 weeks", async () => {
    await expect(
      stake.write.stake([BigInt(1), BigInt(0)]),
    ).to.be.revertedWithCustomError(stake, "InvalidLockPeriod");
  });

  it("Should revert if trying to stake for more than the maximum allowed weeks", async () => {
    const maximumLockWeeks = await stake.read.maximumLockWeeks();

    await expect(
      stake.write.stake([BigInt(1), maximumLockWeeks + BigInt(1)]),
    ).to.be.revertedWithCustomError(stake, "InvalidLockPeriod");
  });

  it("Should revert if staking hasn't started", async () => {
    await expect(
      stake.write.stake([BigInt(1), BigInt(1)]),
    ).to.be.revertedWithCustomError(stake, "StakingNotStarted");
  });

  it("Should set all the storage variables correctly and move the funds", async () => {});

  it("Should mint veOwn tokens at the proper rate", async () => {});

  it("Should emit the Staked event", async () => {});

  it("Should revert if the caller has no balance", async () => {
    // await expect(
    //   stake.write.stake([BigInt(1), BigInt(1)]),
    // ).to.be.revertedWithCustomError(stake, "InsufficientBalance");
  });
});
