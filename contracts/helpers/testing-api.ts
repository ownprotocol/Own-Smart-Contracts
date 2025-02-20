import hre, { ethers, upgrades } from "hardhat";
import UUPSUpgradeable from "../artifacts/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol/Initializable.json";
import OWN from "../artifacts/contracts/OWN.sol/OWN.json";
import { encodeFunctionData } from "viem";

export const ownTestingAPI = async () => {
  const signers = await hre.viem.getWalletClients();

  const deployer = signers[0];

  const Own = await ethers.getContractFactory("OWN");
  const OwnDeployment = await upgrades.deployProxy(Own, [
    deployer.account.address,
    deployer.account.address,
  ]);

  // we use ethers to deploy the contract, but viem to interact with it
  const own = await hre.viem.getContractAt(
    "OWN",
    (await OwnDeployment.getAddress()) as `0x${string}`,
  );

  return {
    own,
    signers,
  };
};
