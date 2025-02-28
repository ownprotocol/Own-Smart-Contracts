import { parseEther } from "viem";
import { ownTestingAPI } from "../../helpers/testing-api";
import { OwnContract, StakeContract, Signers, VeOWN } from "../../types";
import { DayOfWeek, setDayOfWeekInHardhatNode } from "../../helpers/evm";

describe.only("Stake - claimRewards", async () => {
  let own: OwnContract;
  let stake: StakeContract;
  let signers: Signers;
  let veOwn: VeOWN;

  const dailyRewardAmount = parseEther("5");
  const duration = BigInt(7 * 5);

  // await helpers.time.increase(3600);

  beforeEach(async () => {
    ({ stake, own, veOwn, signers } = await ownTestingAPI());
    await stake.write.setDailyRewardAmount([dailyRewardAmount]);
    await stake.write.startStaking();
    const ownBalance = await own.read.balanceOf([signers[0].account.address]);

    await own.write.transfer([stake.address, dailyRewardAmount * duration]);

    await own.write.approve([stake.address, ownBalance]);
  });

  it("Should claim rewards for the last half of the first week of staking", async () => {
    await setDayOfWeekInHardhatNode(DayOfWeek.Wednesday);

    const amount = parseEther("1000");

    await stake.write.stake([amount, duration]);

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    const beforeBalance = await own.read.balanceOf([
      signers[0].account.address,
    ]);

    await stake.write.claimRewards([[BigInt(0)]]);
    const afterBalance = await own.read.balanceOf([signers[0].account.address]);

    console.log("beforeBalance", beforeBalance.toString());
    console.log("afterBalance", afterBalance.toString());
    // TODO: Having a hard time figuring out how to either fast forward the chain to the next wednesday
    // Or pin the chain to a specific date
    // const blockTimestamp = await stake.read.getCurrentDay();
    // const timeUntilNextWednesday =
    // const amount = parseEther("1000");
    // const duration = BigInt(7 * 5);
    // await stake.write.stake([amount, BigInt(duration)]);
    //
    // await stake.write.claimRewards([[BigInt(0)]]);
  });
});
