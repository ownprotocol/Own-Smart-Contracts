import { ethers, upgrades } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  console.log(hre.network.name);
  // throw new Error("This is an error");

  const { deployments } = hre;
  const signers = await hre.viem.getWalletClients();
  const deployer = signers[0];

  const Own = await ethers.getContractFactory("Own");

  // TODO: Setup receiver address for tokens and default admin
  const OwnDeployment = await upgrades.deployProxy(Own, [
    deployer.account.address,
    deployer.account.address,
  ]);

  const address = await OwnDeployment.getAddress();

  console.log("Own deployed at:", await OwnDeployment.getAddress());

  // Save the deployment to hardhat so that the contract can be fetched via ethers.getContract, upgradeable contracts don't do this by default
  deployments.save("Own", {
    address,
    abi: Own.interface.format(),
  });
};

export default func;
func.tags = ["testbed", "_own"];
