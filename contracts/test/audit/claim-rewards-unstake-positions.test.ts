import { expect } from "chai";
import { OwnContract, Signers, StakeContract } from "../../types";
import { parseEther } from "viem";
import hre from "hardhat";
import { getContractInstances } from "../../helpers/testing-api";
import { DayOfWeek, setDayOfWeekInHardhatNode } from "../../helpers/evm";

describe("Audit - Claim Rewards with Already Claimed Positions", async () => {
  let own: OwnContract;
  let stake: StakeContract;
  let signers: Signers;
  let alice: Signers[0];
  let stake_alice: StakeContract;

  beforeEach(async () => {
    ({ stake, own, signers } = await getContractInstances());
    await stake.write.setDailyRewardAmount([parseEther("5")]);
    await stake.write.startStakingNextWeek();
    await setDayOfWeekInHardhatNode(DayOfWeek.Friday);
    alice = signers[1];
    await own.write.transfer([alice.account.address, parseEther("1000")]);
    stake_alice = await hre.viem.getContractAt(
      "Stake",
      stake.address as `0x${string}`,
      { client: { wallet: alice } }
    );

    await own.write.transfer([stake.address, parseEther("100")]);
  });

  it("Should not allow claiming rewards with already claimed positions", async () => {
    await setDayOfWeekInHardhatNode(DayOfWeek.Friday);
    const duration = BigInt(7); // 1 week
    // users stake
    await own.write.approve([stake.address, parseEther("1000")], {
      account: alice.account,
    });
    await stake_alice.write.stake([parseEther("1000"), duration]);

    // Attacker stakes tokens for 1 week
    const amount = parseEther("100");
    await own.write.approve([stake.address, amount]);
    await stake.write.stake([amount, duration]);

    // Move to next Saturday
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
    await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

    const initialBalance = await own.read.balanceOf([stake.address]);
    await stake.write.claimRewards([[BigInt(1), BigInt(1), BigInt(1)]]);
    const finalBalance = await own.read.balanceOf([stake.address]);

    expect(initialBalance - finalBalance).to.equal(parseEther("100"));
  });
});
