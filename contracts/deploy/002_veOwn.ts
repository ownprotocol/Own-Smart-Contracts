import { ethers, upgrades } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments } = hre;

  const VeOwn = await ethers.getContractFactory("VeOwn");
  const VeOwnDeployment = await upgrades.deployProxy(VeOwn);
  await VeOwnDeployment.waitForDeployment();

  const address = await VeOwnDeployment.getAddress();

  console.log("veOwn deployed at:", await VeOwnDeployment.getAddress());

  // Save the deployment to hardhat so that the contract can be fetched via ethers.getContract, upgradeable contracts don't do this by default
  await deployments.save("VeOwn", {
    address,
    abi: JSON.parse(VeOwn.interface.formatJson()),
    ...VeOwn,
  });

  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Get the implementation address
  const implementationAddress =
    await upgrades.erc1967.getImplementationAddress(address);

  // You can also save the implementation separately if needed
  await deployments.save("VeOwnImplementation", {
    address: implementationAddress,
    abi: JSON.parse(VeOwn.interface.formatJson()),
    ...VeOwn,
  });
};

export default func;
func.tags = ["testbed", "_veOwn"];
