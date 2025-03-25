import { MAIN_CHAIN } from "@/config/contracts";
import { SUPPORTED_NETWORK_IDS } from "@/types";
import { useSwitchActiveWalletChain } from "thirdweb/react";
import { useActiveWalletChain } from "thirdweb/react";

export const useCheckAndSwitchToActiveChain = () => {
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();
  const needsSwitch =
    activeChain && !SUPPORTED_NETWORK_IDS.includes(activeChain.id as typeof SUPPORTED_NETWORK_IDS[number]);

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
