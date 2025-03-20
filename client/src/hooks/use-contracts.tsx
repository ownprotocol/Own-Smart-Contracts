import {
  presaleABI,
  stakeABI,
  ownTokenABI,
  veOwnTokenABI,
} from "@/constants/abi";
import { client } from "@/lib/client";
import { getContract } from "thirdweb";
import { type Abi } from "thirdweb/utils";
import { useActiveChainWithDefault } from "./useChainWithDefault";
import { useContractAddresses } from "./use-contract-addresses";

export const useContracts = () => {
  const chain = useActiveChainWithDefault();

  const contractAddresses = useContractAddresses();
  const usdtContract = getContract({
    client,
    address: contractAddresses.usdtAddress,
    chain,
    // This ABI is really just an ERC20 so we can use it here
    abi: ownTokenABI,
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
