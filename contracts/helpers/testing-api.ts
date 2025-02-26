import hre, { ethers, upgrades } from "hardhat";

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

  const Presale = await ethers.getContractFactory("Presale");
  const PresaleDeployment = await upgrades.deployProxy(Presale, [
    own.address,
    // TODO: Deploy mock USDT
    own.address,
  ]);

  // we use ethers to deploy the contract, but viem to interact with it
  const presale = await hre.viem.getContractAt(
    "Presale",
    (await PresaleDeployment.getAddress()) as `0x${string}`,
  );

  // const stake = await hre.viem.deployContract("Stake", [own.address]);
  //
  // const veOWNAddress = await stake.read.veOWN();
  //
  // const veOWN = await hre.viem.getContractAt("VeOWN", veOWNAddress);

  return {
    own,
    signers,
    presale,
  };
};
