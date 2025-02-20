import { expect } from "chai";
import hre from "hardhat";
import { parseEther } from "viem";
import { ownTestingAPI } from "../helpers/testing-api";
import { OwnContract, StakeContract, Signers } from "../types";

describe("OWN staking testing", async () => {
  let own: OwnContract;
  let stake: StakeContract;
  let signers: Signers;

  before(async () => {
    ({ stake, own } = await ownTestingAPI());
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
    const amounts = [
      "1234.567",
      "42000.89",
      "789.123",
      "50000",
      "3456.78",
      "987654.321",
      "2468.135",
      "10000.99",
      "75000.45",
      "369.258",
    ];

    const weeks = [
      "156",
      "42",
      "187",
      "93",
      "128",
      "67",
      "204",
      "15",
      "173",
      "89",
    ];

    for (let i = signers.length - 10; i < signers.length; i++) {
      const ownBalanceBeforeStake = await own.read.balanceOf([
        signers[i].account.address,
      ]);

      const stakeAsUser = await hre.viem.getContractAt("Stake", stake.address, {
        client: { wallet: signers[i] },
      });

      const weekAndAmountIndex = i - (signers.length - 10);
      const stakeAmount = parseEther(amounts[weekAndAmountIndex]);
      await stakeAsUser.write.stake([
        stakeAmount,
        BigInt(weeks[weekAndAmountIndex]),
      ]);

      const ownBalanceAfterStake = await own.read.balanceOf([
        signers[i].account.address,
      ]);

      expect(ownBalanceBeforeStake).equal(ownBalanceAfterStake + stakeAmount);
    }
  });
});
