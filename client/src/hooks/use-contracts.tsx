import {
  presaleABI,
  stakeABI,
  ownTokenABI,
  veOwnTokenABI,
} from "@/constants/abi";
import { client } from "@/lib/client";
import { getContract } from "thirdweb";
import { useActiveChainWithDefault } from "./useChainWithDefault";
import {
  getContractAddresses,
  type SupportedNetworkIds,
} from "@fasset/contracts";

export const useContracts = () => {
  const chain = useActiveChainWithDefault();

  const contractAddresses = getContractAddresses(
    chain.id as SupportedNetworkIds,
  );
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
    abi: veOwnTokenABI,
  });
  return {
    usdtContract,
    presaleContract,
    stakeContract,
    ownTokenContract,
    veOwnTokenContract,
  };
};
