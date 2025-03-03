import { parseEther } from "viem";
import { ownTestingAPI } from "../../helpers/testing-api";
import { OwnContract, StakeContract, Signers, VeOWN } from "../../types";
import { DayOfWeek, setDayOfWeekInHardhatNode } from "../../helpers/evm";
import { expect } from "chai";

describe.only("Stake - claimRewards", async () => {
  let own: OwnContract;
  let stake: StakeContract;
  let signers: Signers;
  let veOwn: VeOWN;

  const dailyRewardAmount = parseEther("5");
  const duration = BigInt(7 * 1);

  beforeEach(async () => {
    ({ stake, own, veOwn, signers } = await ownTestingAPI());
    await stake.write.setDailyRewardAmount([dailyRewardAmount]);
    await stake.write.startStaking();
    const ownBalance = await own.read.balanceOf([signers[0].account.address]);

    await own.write.transfer([stake.address, parseEther("1000")]);

    await own.write.approve([stake.address, ownBalance]);
  });

  it("Should claim rewards in the first week of staking", async () => {
    const currentWeek = Number(await stake.read.getCurrentWeek());

    const boostMultiplier = await stake.read.getBoostMultiplier([
      BigInt(currentWeek),
    ]);

    await setDayOfWeekInHardhatNode(DayOfWeek.Wednesday);

    const dailyRewardAmount = await stake.read.dailyRewardAmount();

    const amount = parseEther("50");

    await stake.write.stake([amount, duration]);

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await expect(
      stake.write.claimRewards([[BigInt(0)]]),
    ).to.changeTokenBalances(
      own,
      [signers[0].account],
      [(dailyRewardAmount * boostMultiplier) / BigInt(1e18)],
    );
  });
});
