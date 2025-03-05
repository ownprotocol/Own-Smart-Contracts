import { ethers, upgrades } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments } = hre;

  const VeOwn = await ethers.getContractFactory("VeOwn");
  const VeOwnDeployment = await upgrades.deployProxy(VeOwn);

  const address = await VeOwnDeployment.getAddress();

  console.log("veOwn deployed at:", await VeOwnDeployment.getAddress());

  // Save the deployment to hardhat so that the contract can be fetched via ethers.getContract, upgradeable contracts don't do this by default
  deployments.save("VeOwn", {
    address,
    abi: VeOwn.interface.format(),
  });
};

export default func;
func.tags = ["testbed", "_veOwn"];
