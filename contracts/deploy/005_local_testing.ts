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

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  if (!isTesting) return;

  console.log("Setting up test environment");

  const { own, stake, presale } = await getContractInstancesFromDeployment(
    await hre.deployments.all()
  );

  await stake.write.setDailyRewardAmount([parseEther("1")]);

  await stake.write.startStakingNextWeek();

  await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

  await own.write.transfer([stake.address, parseEther("1000000")]);

  await own.write.transfer([presale.address, parseEther("1000000")]);

  await presale.write.addPresaleRounds([
    [
      {
        duration: 3600n,
        price: parseEther("1.5"),
        allocation: parseEther("1000"),
        sales: 0n,
        claimTokensTimestamp: 0n,
      },
    ],
  ]);

  const currentTime = await getCurrentBlockTimestamp();
  await presale.write.setPresaleStartTime([BigInt(currentTime + 60)]);
};

export default func;
func.tags = ["testbed", "_testing"];
