import { expect } from "chai";
import hre from "hardhat";
import { parseEther } from "viem";
import { ownTestingAPI } from "../helpers/testing-api";

describe("OWN token testing", async () => {
  let own: Awaited<ReturnType<typeof ownTestingAPI>>["own"];
  let stake: Awaited<ReturnType<typeof ownTestingAPI>>["stake"];
  let signers: Awaited<ReturnType<typeof ownTestingAPI>>["signers"];

  before(async () => {
    ({ stake, own } = await ownTestingAPI());
    signers = await hre.viem.getWalletClients();

    // Transfer 10,000 OWN tokens to the last 10 signers
    for (let i = signers.length - 10; i < signers.length; i++) {
      const current = signers[i].account!.address as `0x${string}`;
      const amount = parseEther("10000");
      await own.write.transfer([current, amount]);

      const balance = await own.read.balanceOf([current]);

      expect(balance).equal(amount);

      // also approve the staking contract to move the users OWN
      const ownAsUser = await hre.viem.getContractAt(
        "OWN" as never,
        own.address,
        {
          client: { wallet: signers[i] },
        },
      );

      const tx = await ownAsUser.write.approve([
        stake.address,
        parseEther("10000000"),
      ]);

      const allowance = await own.read.allowance([
        signers[i].account!.address,
        stake.address,
      ]);

      expect(allowance).equal(parseEther("10000000"));
    }
  });

  it("should let me stake and return the correct amount of veOwn", async () => {});
});
