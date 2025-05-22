import { parseEther } from "viem";
import { getContractInstances } from "../../helpers/testing-api";
import { OwnContract, StakeContract, Signers } from "../../types";
import { DayOfWeek, setDayOfWeekInHardhatNode } from "../../helpers/evm";
import { expect } from "chai";

describe("Stake - getUsersActiveVeOwnBalance", async () => {
  let own: OwnContract;
  let stake: StakeContract;
  let signers: Signers;
  let alice: Signers[0];

  const dailyRewardAmount = parseEther("5");

  const stakeInitialBalance = parseEther("1000");

  beforeEach(async () => {
    ({ stake, own, signers } = await getContractInstances());
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

    const veOwnBalance = await stake.read.getUsersActiveVeOwnBalance([
      signers[0].account.address,
    ]);

    expect(veOwnBalance).to.equal(veOwnAmount);
  });

  it("Should return 0 veOwn balance when the stake finishes", async () => {
    const stakeFor5Weeks = BigInt(7);
    await stake.write.stake([stakeInitialBalance, stakeFor5Weeks]);

    // Jump to the day after their stake finishes, which is a Sunday
    // Have to skip 2 sundays because the first moves us 1 day ahead, then the second moves a week ahead
    await setDayOfWeekInHardhatNode(DayOfWeek.Sunday);
    await setDayOfWeekInHardhatNode(DayOfWeek.Sunday);

    const veOwnBalance = await stake.read.getUsersActiveVeOwnBalance([
      signers[0].account.address,
    ]);

    expect(veOwnBalance).to.equal(0n);
  });
});
