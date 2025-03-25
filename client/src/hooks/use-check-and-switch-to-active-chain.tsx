/* eslint-disable @typescript-eslint/no-explicit-any */
import { MAIN_CHAIN } from "@/config/contracts";
import { useSwitchActiveWalletChain } from "thirdweb/react";
import { useActiveWalletChain } from "thirdweb/react";

export const useCheckAndSwitchToActiveChain = () => {
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();

  const needsSwitch =
    activeChain?.id === 1337
      ? false
      : activeChain && activeChain.name !== MAIN_CHAIN.name;

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
