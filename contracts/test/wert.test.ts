import hre from "hardhat";
import { getLocalAddress } from "../helpers/evm";

const WERT_TOKEN_ADDRESS = "0x42D8BCf255125BB186459AF66bB74EEF8b8cC391";

const WERT_TEST_TOKEN_WHALE = "0x12296d8c1d0a1ef544ec86d5e3c6a005ee23ab95";

describe.only("Wert", async () => {
  it("should have the correct max supply minted on deployment", async () => {
    const deployedPresaleContract = await getLocalAddress("presale", "sepolia");
    const presaleContract = await hre.viem.getContractAt(
      "Presale",
      deployedPresaleContract
    );

    const client = await hre.viem.getTestClient();
    const wertToken = await hre.viem.getContractAt(
      "IERC20",
      WERT_TOKEN_ADDRESS
    );

    const balance = await wertToken.read.balanceOf([WERT_TEST_TOKEN_WHALE]);

    console.log("Whale balance", balance);

    await client.impersonateAccount({ address: WERT_TEST_TOKEN_WHALE });

    console.log(await wertToken.read.balanceOf([WERT_TEST_TOKEN_WHALE]));

    await wertToken.write.approve([deployedPresaleContract, BigInt(100)], {
      account: WERT_TEST_TOKEN_WHALE,
    });

    await presaleContract.write.purchasePresaleTokens(
      [BigInt(100), WERT_TEST_TOKEN_WHALE],
      { account: WERT_TEST_TOKEN_WHALE }
    );
  });
});
