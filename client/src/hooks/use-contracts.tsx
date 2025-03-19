import {
  presaleABI,
  stakeABI,
  ownTokenABI,
  veOwnTokenABI,
} from "@/constants/abi";
import { getContractAddresses, MAIN_CHAIN } from "@/config/contracts";
import { client } from "@/lib/client";
import { getContract } from "thirdweb";
import { type Abi } from "thirdweb/utils";
import { useActiveWalletChain } from "thirdweb/react";

export const useContracts = () => {
  const chain = useActiveWalletChain() ?? MAIN_CHAIN;

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
