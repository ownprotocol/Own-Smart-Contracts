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

  const [deployer] = await hre.ethers.getSigners();

  const { own, stake, presale, mockUSDT } =
    await getContractInstancesFromDeployment(await hre.deployments.all());

  await stake.write.setMaximumDailyRewardAmount([parseEther("100")]);
  //
  await stake.write.setDailyRewardAmount([parseEther("1")]);

  await stake.write.startStakingNextWeek();

  await setDayOfWeekInHardhatNode(DayOfWeek.Saturday);

  await own.write.transfer([stake.address, parseEther("1000000")]);

  await own.write.transfer([presale.address, parseEther("1000000")]);

  await presale.write.addPresaleRounds([
    [
      {
        duration: 86400n,
        price: parseEther("1.5"),
        allocation: parseEther("1000"),
        sales: 0n,
        claimTokensTimestamp: 0n,
      },
      {
        duration: 86400n,
        price: parseEther("2.5"),
        allocation: parseEther("1000"),
        sales: 0n,
        claimTokensTimestamp: 0n,
      },
      {
        duration: 86400n,
        price: parseEther("2.5"),
        allocation: parseEther("1000"),
        sales: 0n,
        claimTokensTimestamp: 0n,
      },
      {
        duration: 86400n,
        price: parseEther("2.5"),
        allocation: parseEther("1000"),
        sales: 0n,
        claimTokensTimestamp: 0n,
      },
      {
        duration: 86400n,
        price: parseEther("2.5"),
        allocation: parseEther("1000"),
        sales: 0n,
        claimTokensTimestamp: 0n,
      },
    ],
  ]);

  const currentTime = await getCurrentBlockTimestamp();
  await presale.write.setPresaleStartTime([BigInt(currentTime + 1)]);

  await mockUSDT.write.mint([deployer.address as any, parseEther("1000000")]);
};

export default func;
func.tags = ["testbed", "_testing"];
