import { MAIN_CHAIN } from "@/config/contracts";
import { type ChainOptions } from "thirdweb/chains";
import { useActiveWalletChain } from "thirdweb/react";

export const useActiveChainWithDefault = (): Readonly<
  ChainOptions & {
    rpc: string;
  }
> => {
  const activeChain = useActiveWalletChain();

  if (activeChain?.id === 1337) {
    return {
      id: 1337,
      name: "Hardhat",
      rpc: "http://localhost:8545",
    };
  }

  return activeChain ?? MAIN_CHAIN;
};
