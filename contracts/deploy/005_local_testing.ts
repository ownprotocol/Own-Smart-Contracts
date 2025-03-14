import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getContractInstancesFromDeployment } from "../helpers/testing-api";
import { DayOfWeek, setDayOfWeekInHardhatNode } from "../helpers/evm";
import { parseEther } from "ethers";

const isTesting = process.env.IS_TESTING || false;

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  if (!isTesting) return;

  console.log("Setting up test environment");

  const { own, stake } = await getContractInstancesFromDeployment(
    await hre.deployments.all()
  );

  await stake.write.setDailyRewardAmount([parseEther("1")]);

  await stake.write.startStakingNextWeek();

  await own.write.transfer([stake.address, parseEther("1000000")]);

  await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);
};

export default func;
func.tags = ["testbed", "_testing"];
