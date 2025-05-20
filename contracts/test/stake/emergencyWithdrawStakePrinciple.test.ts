import { parseEther } from "viem";
import { getContractInstances } from "../../helpers/testing-api";
import { OwnContract, StakeContract, Signers } from "../../types";
import { DayOfWeek, setDayOfWeekInHardhatNode } from "../../helpers/evm";
import { expect } from "chai";

describe("Stake - emergencyWithdrawStakePrinciple", async () => {
  let own: OwnContract;
  let stake: StakeContract;
  let signers: Signers;
  let alice: Signers[0];

  const dailyRewardAmount = parseEther("5");
  const duration = BigInt(7);

  const stakeInitialBalance = parseEther("1000");

  beforeEach(async () => {
    ({ stake, own, signers } = await getContractInstances());
    alice = signers[1];
    await stake.write.setDailyRewardAmount([dailyRewardAmount]);

    await stake.write.startStakingNextWeek();

    await setDayOfWeekInHardhatNode(DayOfWeek.Friday);

    const ownBalance = await own.read.balanceOf([signers[0].account.address]);

    await own.write.transfer([stake.address, stakeInitialBalance]);

    await own.write.approve([stake.address, ownBalance]);
  });

  it("Should revert if calling from an account that doesn't own the stake", async () => {
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await expect(
      stake.write.emergencyWithdrawStakePrinciple([[BigInt(0)]], {
        account: alice.account,
      })
    ).to.be.revertedWithCustomError(stake, "CallerDoesNotOwnPosition");
  });

  it("Should revert if calling before staking starts", async () => {
    await expect(
      stake.write.emergencyWithdrawStakePrinciple([[BigInt(0)]])
    ).to.be.revertedWithCustomError(stake, "StakingNotStarted");
  });

  it("Should revert if there are no rewards to be claimed", async () => {
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await stake.write.stake([parseEther("50"), duration]);

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await expect(
      stake.write.emergencyWithdrawStakePrinciple([[BigInt(0)]])
    ).to.be.revertedWithCustomError(stake, "NoEmergencyPrincipleToWithdraw");
  });

  it("Should allow to emergency withdraw stake principle", async () => {
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    const stakeAmount = parseEther("50");

    await stake.write.stake([stakeAmount, duration]);

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await expect(
      stake.write.emergencyWithdrawStakePrinciple([[BigInt(0)]])
    ).to.changeTokenBalance(own, signers[0].account.address, stakeAmount);
  });

  it("Should revert when trying to claim rewards after emergency withdraw", async () => {
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    const stakeAmount = parseEther("50");

    await stake.write.stake([stakeAmount, duration]);

    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    await stake.write.emergencyWithdrawStakePrinciple([[BigInt(0)]]);

    // Validate the methods fail
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    await expect(
      stake.write.emergencyWithdrawStakePrinciple([[BigInt(0)]])
    ).to.be.revertedWithCustomError(stake, "NoEmergencyPrincipleToWithdraw");
    await expect(
      stake.write.claimRewards([[BigInt(0)]])
    ).to.be.revertedWithCustomError(stake, "NoRewardsToClaim");
  });
});
