import hre, { ethers, upgrades } from "hardhat";

export const ownTestingAPI = async () => {
  const signers = await hre.viem.getWalletClients();

  // Remve first signer, as it is the deployer
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

  const VeOwn = await ethers.getContractFactory("VeOWN");
  const VeOwnDeployment = await upgrades.deployProxy(VeOwn);

  // we use ethers to deploy the contract, but viem to interact with it
  const veOwn = await hre.viem.getContractAt(
    "VeOWN",
    (await VeOwnDeployment.getAddress()) as `0x${string}`,
  );

  const MockUSDT = await ethers.getContractFactory("MockERC20");
  const MockUSDTDeployment = await MockUSDT.deploy();

  const mockUSDT = await hre.viem.getContractAt(
    "MockERC20",
    (await MockUSDTDeployment.getAddress()) as `0x${string}`,
  );

  const Presale = await ethers.getContractFactory("Presale");
  const PresaleDeployment = await upgrades.deployProxy(Presale, [
    own.address,
    mockUSDT.address,
  ]);

  // we use ethers to deploy the contract, but viem to interact with it
  const presale = await hre.viem.getContractAt(
    "Presale",
    (await PresaleDeployment.getAddress()) as `0x${string}`,
  );

  const Stake = await ethers.getContractFactory("Stake");
  const StakeDeployment = await upgrades.deployProxy(Stake, [
    own.address,
    veOwn.address,
    // TODO: Add sablier lockup address
    veOwn.address,
  ]);

  const stake = await hre.viem.getContractAt(
    "Stake",
    (await StakeDeployment.getAddress()) as `0x${string}`,
  );

  // const stake = await hre.viem.deployContract("Stake", [own.address]);
  //
  // const veOWNAddress = await stake.read.veOWN();
  //
  // const veOWN = await hre.viem.getContractAt("VeOWN", veOWNAddress);

  return {
    own,
    veOwn,
    signers,
    presale,
    mockUSDT,
    stake,
  };
};
