import { getActiveChain } from "@/config/chain";
import {
  presaleABI,
  stakeABI,
  ownTokenABI,
  veOwnTokenABI,
} from "@/constants/abi";
import { getContractAddresses } from "@/config/contracts";
import { client } from "@/lib/client";
import { type Chain, getContract } from "thirdweb";
import { localhost, mainnet, sepolia } from "thirdweb/chains";
import { type Abi } from "thirdweb/utils";

export const useContracts = () => {
  const activeChain = getActiveChain();
  let chain: Chain;
  if (activeChain.name === "Sepolia") {
    chain = sepolia;
  } else if (activeChain.name === "Localhost") {
    chain = localhost;
  } else {
    chain = mainnet;
  }
  const contractAddresses = getContractAddresses();
  const usdtContract = getContract({
    client,
    address: contractAddresses.usdtAddress,
    chain,
  });

  const presaleContract = getContract({
    client,
    address: contractAddresses.presaleAddress,
    chain,
    abi: presaleABI,
  });

  const stakeContract = getContract({
    client,
    address: contractAddresses.stakeAddress,
    chain,
    abi: stakeABI,
  });

  const ownTokenContract = getContract({
    client,
    address: contractAddresses.ownTokenAddress,
    chain,
    abi: ownTokenABI,
  });

  const veOwnTokenContract = getContract({
    client,
    address: contractAddresses.veOwnTokenAddress,
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
