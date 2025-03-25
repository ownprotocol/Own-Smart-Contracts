import { MAIN_CHAIN } from "@/config/contracts";
import { HARDHAT_CHAIN_ID } from "@/constants/network";
import { localhost, type ChainOptions } from "thirdweb/chains";
import { useActiveWalletChain } from "thirdweb/react";

export const useActiveChainWithDefault = (): Readonly<
  ChainOptions & {
    rpc: string;
  }
> => {
  const activeChain = useActiveWalletChain();

  // Thirdweb gives us a different rpc for the hardhat chain, so overriding it here
  if (activeChain?.id === HARDHAT_CHAIN_ID) {
    return localhost;
  }

  return activeChain ?? MAIN_CHAIN;
};
