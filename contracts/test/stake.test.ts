import { expect } from "chai";
import hre from "hardhat";
import { parseEther } from "viem";
import { ownTestingAPI } from "../helpers/testing-api";
import { OwnContract, StakeContract, Signers, VeOWN } from "../types";
import { amounts, weeks } from "../constants/mock-data";

describe("OWN staking testing", async () => {
  let own: OwnContract;
  let stake: StakeContract;
  let signers: Signers;
  let veOWN: VeOWN;

  before(async () => {
    ({ stake, own, veOWN } = await ownTestingAPI());
    signers = await hre.viem.getWalletClients();

    // Transfer 10,000 OWN tokens to the last 10 signers
    // Also approve the staking contract to move the users tokens
    for (let i = signers.length - 10; i < signers.length; i++) {
      const current = signers[i].account!.address as `0x${string}`;
      const amount = parseEther("10000000");
      await own.write.transfer([current, amount]);

      const balance = await own.read.balanceOf([current]);

      expect(balance).equal(amount);
      // also approve the staking contract to move the users OWN
      const ownAsUser = await hre.viem.getContractAt("OWN", own.address, {
        client: { wallet: signers[i] },
      });

      await ownAsUser.write.approve([stake.address, amount]);

      const allowance = await own.read.allowance([
        signers[i].account!.address,
        stake.address,
      ]);

      expect(allowance).equal(amount);
    }
  });

  it("should let me stake and return the correct amount of veOwn", async () => {
    for (let i = signers.length - 10; i < signers.length; i++) {
      const currentAddress = signers[i].account.address;

      const ownBalanceBeforeStake = await own.read.balanceOf([currentAddress]);
      const veOwnBalanceBeforeStake = await veOWN.read.balanceOf([
        currentAddress,
      ]);

      const stakeAsUser = await hre.viem.getContractAt("Stake", stake.address, {
        client: { wallet: signers[i] },
      });

      const weekAndAmountIndex = i - (signers.length - 10);
      const stakeAmount = parseEther(amounts[weekAndAmountIndex]);
      const weekAmount = BigInt(weeks[weekAndAmountIndex]);

      const expectedVeOwnAmount = stakeAmount * BigInt(weekAmount);
      await stakeAsUser.write.stake([stakeAmount, weekAmount]);

      const ownBalanceAfterStake = await own.read.balanceOf([currentAddress]);

      const veOwnBalanceAfterStake = await veOWN.read.balanceOf([
        currentAddress,
      ]);

      expect(veOwnBalanceAfterStake).eq(
        expectedVeOwnAmount + veOwnBalanceBeforeStake,
      );
      expect(ownBalanceBeforeStake).equal(ownBalanceAfterStake + stakeAmount);
    }
  });
});
