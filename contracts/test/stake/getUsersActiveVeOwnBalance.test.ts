import { parseEther } from "viem";
import { getContractInstances } from "../../helpers/testing-api";
import { OwnContract, StakeContract, Signers, VeOwn } from "../../types";
import { DayOfWeek, setDayOfWeekInHardhatNode } from "../../helpers/evm";
import { expect } from "chai";

describe("Stake - getUsersActiveVeOwnBalance", async () => {
  let own: OwnContract;
  let stake: StakeContract;
  let signers: Signers;
  let alice: Signers[0];
  let veOwn: VeOwn;

  const dailyRewardAmount = parseEther("5");

  const stakeInitialBalance = parseEther("1000");

  beforeEach(async () => {
    ({ stake, own, signers, veOwn } = await getContractInstances());
    alice = signers[1];
    await stake.write.setDailyRewardAmount([dailyRewardAmount]);

    await stake.write.startStakingNextWeek();

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    const ownBalance = await own.read.balanceOf([signers[0].account.address]);

    await own.write.transfer([stake.address, stakeInitialBalance]);

    await own.write.approve([stake.address, ownBalance]);
  });

  it("Should return the correct veOwn balance while the stake is in progress", async () => {
    const stakeFor5Weeks = BigInt(7 * 5);
    await stake.write.stake([stakeInitialBalance, stakeFor5Weeks]);

    const [{ veOwnAmount }] = await stake.read.getUsersPositions([
      signers[0].account.address,
    ]);

    await setDayOfWeekInHardhatNode(DayOfWeek.Sunday);

    const veOwnBalance = await stake.read.getUsersActiveVeOwnBalance([
      signers[0].account.address,
    ]);

    expect(veOwnBalance).to.equal(veOwnAmount);
    expect(await veOwn.read.balanceOf([signers[0].account.address])).to.equal(
      veOwnAmount,
    );

    const totalVeOwn = await stake.read.getTotalActiveVeOwnSupply();
    expect(totalVeOwn).to.equal(veOwnBalance);

    expect(totalVeOwn).to.equal(await veOwn.read.totalSupply());
  });

  it("Should return 0 veOwn balance when the stake finishes", async () => {
    const stakeFor5Weeks = BigInt(7);

    await stake.write.stake([stakeInitialBalance, stakeFor5Weeks]);

    const [{ veOwnAmount }] = await stake.read.getUsersPositions([
      signers[0].account.address,
    ]);

    // Jump to the day after their stake finishes, which is a Sunday
    // Have to skip 2 sundays because the first moves us 1 day ahead, then the second moves a week ahead
    await setDayOfWeekInHardhatNode(DayOfWeek.Sunday);
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    // Check values before the stake finishes
    const beforeVeOwnBalance = await stake.read.getUsersActiveVeOwnBalance([
      signers[0].account.address,
    ]);

    expect(veOwnAmount).to.equal(beforeVeOwnBalance);

    const beforeTotalVeOwn = await stake.read.getTotalActiveVeOwnSupply();
    expect(beforeTotalVeOwn).to.equal(beforeVeOwnBalance);

    // Move a day forward, to the last day of the stake
    await setDayOfWeekInHardhatNode(DayOfWeek.Sunday);

    const veOwnBalance = await stake.read.getUsersActiveVeOwnBalance([
      signers[0].account.address,
    ]);

    expect(veOwnBalance).to.equal(0n);

    const totalVeOwn = await stake.read.getTotalActiveVeOwnSupply();
    expect(totalVeOwn).to.equal(0n);
    expect(totalVeOwn).to.equal(await veOwn.read.totalSupply());
  });
});
