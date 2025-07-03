import { parseEther } from "ethers";
import hre from "hardhat";
import { Deployment } from "hardhat-deploy/dist/types";

export const getContractInstancesFromDeployment = async (
  deployment: Record<string, Deployment>,
) => {
  const { Own, VeOwn, mockUSDT, presale, mockSablierLockup, stake } =
    deployment;

  const signers = await hre.viem.getWalletClients();

  // we use ethers to deploy the contract, but viem to interact with it
  const ownContract = await hre.viem.getContractAt(
    "Own",
    Own.address as `0x${string}`,
  );

  // we use ethers to deploy the contract, but viem to interact with it
  const veOwnContract = await hre.viem.getContractAt(
    "VeOwn",
    VeOwn.address as `0x${string}`,
  );

  const mockUSDTContract = await hre.viem.getContractAt(
    "MockERC20",
    mockUSDT.address as `0x${string}`,
  );

  // we use ethers to deploy the contract, but viem to interact with it
  const presaleContract = await hre.viem.getContractAt(
    "Presale",
    presale.address as `0x${string}`,
  );

  const mockSablierLockupContract = await hre.viem.getContractAt(
    "MockSablierLockup",
    mockSablierLockup.address as `0x${string}`,
  );

  const stakeContract = await hre.viem.getContractAt(
    "Stake",
    stake.address as `0x${string}`,
  );

  await stakeContract.write.setMaximumDailyRewardAmount([parseEther("1000")]);

  return {
    own: ownContract,
    veOwn: veOwnContract,
    signers,
    presale: presaleContract,
    mockUSDT: mockUSDTContract,
    stake: stakeContract,
    mockSablierLockup: mockSablierLockupContract,
  };
};

export const getContractInstances = async () => {
  const deployment = await hre.deployments.fixture("testbed");

  return getContractInstancesFromDeployment(deployment);
};
