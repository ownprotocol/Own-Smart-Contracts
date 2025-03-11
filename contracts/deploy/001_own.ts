import { ethers, upgrades } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments } = hre;
  const signers = await hre.viem.getWalletClients();
  const deployer = signers[0];

  const Own = await ethers.getContractFactory("Own");

  const OwnDeployment = await upgrades.deployProxy(
    Own,
    [deployer.account.address, deployer.account.address],
    { metadata: { tag: "Own" } },
  );

  await OwnDeployment.waitForDeployment();
  const address = await OwnDeployment.getAddress();

  console.log("Own deployed at:", await OwnDeployment.getAddress());

  // Save the deployment to hardhat so that the contract can be fetched via ethers.getContract, upgradeable contracts don't do this by default
  await deployments.save("Own", {
    address,
    abi: JSON.parse(Own.interface.formatJson()),
    ...Own,
  });

  if (hre.network.name !== "hardhat") {
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  // Get the implementation address
  const implementationAddress =
    await upgrades.erc1967.getImplementationAddress(address);

  // You can also save the implementation separately if needed
  await deployments.save("OwnImplementation", {
    address: implementationAddress,
    abi: JSON.parse(Own.interface.formatJson()),
    ...Own,
  });
};

export default func;
func.tags = ["testbed", "_own"];
