import { getActiveChain } from "@/config/chain";
import {
  presaleABI,
  stakeABI,
  ownTokenABI,
  veOwnTokenABI,
} from "@/constants/abi";
import {
  PresaleAddress,
  StakeAddress,
  USDTAddress,
  OwnTokenAddress,
  veOwnTokenAddress,
} from "@/constants/contracts";
import { client } from "@/lib/client";
import { type Chain, getContract } from "thirdweb";
import { localhost, mainnet, sepolia } from "thirdweb/chains";
import { type Abi } from "thirdweb/utils";

/**
 * Chain configuration for the application
 * Supports switching between mainnet, testnet, and local development environments
 * based on environment variables
 * chain name: sepolia, mainnet, localhost
 */

export const useContracts = () => {
  const activeChain = getActiveChain();
  let chain: Chain;
  if (activeChain.name === "sepolia") {
    chain = sepolia;
  } else if (activeChain.name === "localhost") {
    chain = localhost;
  } else {
    chain = mainnet;
  }
  const usdtContract = getContract({
    client,
    address: USDTAddress,
    chain,
  });

  const presaleContract = getContract({
    client,
    address: PresaleAddress,
    chain,
    abi: presaleABI,
  });

  const stakeContract = getContract({
    client,
    address: StakeAddress,
    chain,
    abi: stakeABI,
  });

  const ownTokenContract = getContract({
    client,
    address: OwnTokenAddress,
    chain,
    abi: ownTokenABI,
  });

  const veOwnTokenContract = getContract({
    client,
    address: veOwnTokenAddress,
    chain,
    abi: veOwnTokenABI as Abi,
  });
  return {
    usdtContract,
    presaleContract,
    stakeContract,
    ownTokenContract,
    veOwnTokenContract,
  };
};
