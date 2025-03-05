import { ethers, upgrades } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments } = hre;

  const { Own } = await deployments.all();

  const Presale = await ethers.getContractFactory("Presale");

  let usdtAddress;
  if (hre.network.name === "hardhat") {
    const MockUSDT = await ethers.getContractFactory("MockERC20");
    const MockUSDTDeployment = await MockUSDT.deploy();

    usdtAddress = await MockUSDTDeployment.getAddress();

    deployments.save("mockUSDT", {
      address: usdtAddress,
      abi: MockUSDT.interface.format(),
    });
  } else {
    throw new Error("USDT address not set for network");
  }

  const PresaleDeployment = await upgrades.deployProxy(Presale, [
    Own.address,
    usdtAddress,
  ]);

  // we use ethers to deploy the contract, but viem to interact with it
  const presale = await hre.viem.getContractAt(
    "Presale",
    (await PresaleDeployment.getAddress()) as `0x${string}`,
  );

  console.log("Presale deployed at:", await PresaleDeployment.getAddress());

  // Save the deployment to hardhat so that the contract can be fetched via ethers.getContract, upgradeable contracts don't do this by default
  deployments.save("presale", {
    address: await PresaleDeployment.getAddress(),
    abi: PresaleDeployment.interface.format(),
  });
};

export default func;
func.tags = ["testbed", "_presale"];
