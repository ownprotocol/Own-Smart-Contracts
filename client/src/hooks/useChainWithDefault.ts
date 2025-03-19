import { MAIN_CHAIN } from "@/config/contracts";
import { hardhat } from "thirdweb/chains";
import { useActiveWalletChain } from "thirdweb/react";

export const useActiveChainWithDefault = () => {
  const activeChain = useActiveWalletChain();

  if (activeChain?.id === 1337) {
    return hardhat;
  }

  return activeChain ?? MAIN_CHAIN;
};
