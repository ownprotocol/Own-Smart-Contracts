import { presaleABI, stakeABI, ownTokenABI } from "@/constants/abi";
import {
  PresaleAddress,
  StakeAddress,
  USDTAddress,
  OwnTokenAddress,
} from "@/constants/contracts";
import { client } from "@/lib/client";
import { type Chain, getContract } from "thirdweb";
import { localhost, mainnet, sepolia } from "thirdweb/chains";
import { useChainMetadata } from "thirdweb/react";

export const useContracts = () => {
  const { data: chainMetadata } = useChainMetadata();
  let chain: Chain;
  if (chainMetadata?.name === "Sepolia") {
    chain = sepolia;
  } else if (chainMetadata?.name === "Hardhat") {
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
  return { usdtContract, presaleContract, stakeContract, ownTokenContract };
};
