/* eslint-disable @typescript-eslint/no-explicit-any */
import { MAIN_CHAIN } from "@/config/contracts";
import { SUPPORTED_NETWORKS } from "@/types";
import { useSwitchActiveWalletChain } from "thirdweb/react";
import { useActiveWalletChain } from "thirdweb/react";

export const useCheckAndSwitchToActiveChain = () => {
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();

  const needsSwitch =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    activeChain && SUPPORTED_NETWORKS.includes(activeChain?.name as any);

  const switchToCorrectChain = async () => {
    if (needsSwitch) {
      await switchChain(MAIN_CHAIN);
    }
  };

  return {
    needsSwitch,
    switchToCorrectChain,
    currentAppChain: MAIN_CHAIN,
  };
};

export default useCheckAndSwitchToActiveChain;
