import { parseEther } from "ethers";
import { ethers, network, upgrades } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { MINTER_ROLE } from "../constants/roles";
import { isTestNetwork } from "../helpers/deployments";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments } = hre;
  const { Own, VeOwn } = await deployments.all();

  let sablierAddress;
  if (isTestNetwork()) {
    const SablierLockup = await ethers.getContractFactory("MockSablierLockup");
    const SablierDeployment = await SablierLockup.deploy(Own.address);
    await SablierDeployment.waitForDeployment();

    const mockSablierLockup = await hre.viem.getContractAt(
      "MockSablierLockup",
      (await SablierDeployment.getAddress()) as `0x${string}`,
    );

    sablierAddress = mockSablierLockup.address;

    await deployments.save("mockSablierLockup", {
      address: sablierAddress,
      abi: JSON.parse(SablierLockup.interface.formatJson()),
      ...SablierLockup,
    });
  } else {
    if (network.name === "mainnet") {
      // Sablier addresses: https://docs.sablier.com/guides/lockup/deployments
      sablierAddress = "0x7C01AA3783577E15fD7e272443D44B92d5b21056";
    } else if (network.name === "arbitrum") {
      sablierAddress = "0x467D5Bf8Cfa1a5f99328fBdCb9C751c78934b725";
    } else {
      throw new Error("SablierLockup not deployed in network");
    }
  }

  const Stake = await ethers.getContractFactory("Stake");
  const StakeDeployment = await upgrades.deployProxy(Stake, [
    Own.address,
    VeOwn.address,
    sablierAddress,
  ]);
  await StakeDeployment.waitForDeployment();

  const stake = await hre.viem.getContractAt(
    "Stake",
    (await StakeDeployment.getAddress()) as `0x${string}`,
  );

  console.log("Stake deployed at:", await StakeDeployment.getAddress());

  await deployments.save("stake", {
    address: stake.address,
    abi: JSON.parse(Stake.interface.formatJson()),
    ...Stake,
  });

  if (hre.network.name !== "hardhat") {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  // Get the implementation address
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(
    await StakeDeployment.getAddress(),
  );

  // You can also save the implementation separately if needed
  await deployments.save("StakeImplementation", {
    address: implementationAddress,
    abi: JSON.parse(StakeDeployment.interface.formatJson()),
    ...StakeDeployment,
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

  // Fix remove these
  const veOwnContract = await hre.viem.getContractAt(
    "VeOwn",
    VeOwn.address as `0x${string}`,
  );

  await veOwnContract.write.setStakeContract([stake.address]);

  await veOwnContract.write.grantRole([MINTER_ROLE, stake.address]);
};

export default func;
func.tags = ["testbed", "_veOwn"];
