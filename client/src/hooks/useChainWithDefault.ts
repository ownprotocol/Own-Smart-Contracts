import { MAIN_CHAIN } from "@/config/contracts";
import { SUPPORTED_NETWORK_IDS, SupportedNetworkIds } from "@fasset/contracts";
import { localhost, type ChainOptions } from "thirdweb/chains";
import { useActiveWalletChain } from "thirdweb/react";

export const useActiveChainWithDefault = (): Readonly<
  ChainOptions & {
    rpc: string;
  }
> => {
  const activeChain = useActiveWalletChain();

  // Thirdweb gives us a different rpc for the hardhat chain, so overriding it here
  if (SUPPORTED_NETWORK_IDS.includes(activeChain?.id as SupportedNetworkIds)) {
    // For some reason the returned chain isn't compatible with a local hardhat node and throws errors, so have to override the response here
    if (activeChain?.id === 1337) {
      return localhost;
    }
    return activeChain!;
  }

  return MAIN_CHAIN;
};
