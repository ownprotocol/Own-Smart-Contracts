import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getContractInstancesFromDeployment } from "../helpers/testing-api";
import {
  DayOfWeek,
  getCurrentBlockTimestamp,
  setDayOfWeekInHardhatNode,
} from "../helpers/evm";
import { parseEther } from "ethers";

const isTesting = process.env.IS_TESTING || false;

const ADDRESSES_TO_ISSUE_SEPOLIA_TEST_TOKENS = [
  "0x6F7A976209aEB9e448510127f4A14049922D260a",
  "0x888141fF4561D6739F9196538580E068c8E3EFA1",
  "0x12EAD0881793314D63B6BACE59Ee5F827971e27A",
  "0x891ad32f5Fc606E09564603869F522c685cAf8A8",
];

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  if (!isTesting) return;

  console.log("Setting up test environment");

  const [deployer] = await hre.ethers.getSigners();

  const { own, stake, presale, mockUSDT } =
    await getContractInstancesFromDeployment(await hre.deployments.all());

  await stake.write.setMaximumDailyRewardAmount([parseEther("100")]);

  await stake.write.setDailyRewardAmount([parseEther("1")]);

  await stake.write.startStakingNextWeek();

  await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

  await own.write.transfer([stake.address, parseEther("1000000")]);

  await own.write.transfer([presale.address, parseEther("1000000")]);

  const rounds = Array.from({ length: 30 }, (_, i) => i).map(() => ({
    duration: 86400n,
    price: parseEther("1.5"),
    allocation: parseEther("1000"),
    sales: 0n,
    claimTokensTimestamp: 0n,
  }));
  await presale.write.addPresaleRounds([rounds]);

  const currentTime = await getCurrentBlockTimestamp();
  await presale.write.setPresaleStartTime([BigInt(currentTime + 2)]);

  await mockUSDT.write.mint([deployer.address as any, parseEther("1000000")]);

  if (hre.network.name === "sepolia") {
    for (const address of ADDRESSES_TO_ISSUE_SEPOLIA_TEST_TOKENS) {
      await mockUSDT.write.mint([address as any, parseEther("1000000")]);
      await own.write.transfer([address as any, parseEther("1000000")]);
    }
  }
};

export default func;
func.tags = ["testbed", "_testing"];
