import { parseEther } from "ethers";
import { ethers, upgrades } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { MINTER_ROLE } from "../constants/roles";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments } = hre;
  const { Own, VeOwn } = await deployments.all();

  let sablierAddress;
  if (hre.network.name === "hardhat") {
    const SablierLockup = await ethers.getContractFactory("MockSablierLockup");
    const SablierDeployment = await SablierLockup.deploy(Own.address);

    const mockSablierLockup = await hre.viem.getContractAt(
      "MockSablierLockup",
      (await SablierDeployment.getAddress()) as `0x${string}`,
    );

    sablierAddress = mockSablierLockup.address;

    deployments.save("mockSablierLockup", {
      address: sablierAddress,
      abi: SablierLockup.interface.format(),
    });
  } else {
    throw new Error("SablierLockup not deployed in network");
  }

  const Stake = await ethers.getContractFactory("Stake");
  const StakeDeployment = await upgrades.deployProxy(Stake, [
    Own.address,
    VeOwn.address,
    sablierAddress,
  ]);

  const stake = await hre.viem.getContractAt(
    "Stake",
    (await StakeDeployment.getAddress()) as `0x${string}`,
  );

  deployments.save("stake", {
    address: stake.address,
    abi: Stake.interface.format(),
  });

  await stake.write.addBoostDetails([
    [
      {
        startWeek: BigInt(0),
        durationInWeeks: BigInt(1),
        multiplier: parseEther("10"),
      },
      {
        startWeek: BigInt(1),
        durationInWeeks: BigInt(3),
        multiplier: parseEther("5"),
      },
      {
        startWeek: BigInt(4),
        durationInWeeks: BigInt(8),
        multiplier: parseEther("3"),
      },
    ],
  ]);

  await stake.write.setMaximumDailyRewardAmount([parseEther("10000")]);

  const veOwnContract = await hre.viem.getContractAt(
    "VeOwn",
    VeOwn.address as `0x${string}`,
  );

  await veOwnContract.write.grantRole([MINTER_ROLE, stake.address]);
};

export default func;
func.tags = ["testbed", "_veOwn"];
