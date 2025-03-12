import { useEffect } from "react";
import { getActiveChain } from "@/config/chain";
import { useSwitchActiveWalletChain } from "thirdweb/react";
import { useActiveWalletChain } from "thirdweb/react";

export const useCheckAndSwitchToActiveChain = () => {
  const activeChain = useActiveWalletChain();

  const currentChain = getActiveChain();
  const switchChain = useSwitchActiveWalletChain();

  useEffect(() => {
    if (activeChain && activeChain.name !== currentChain.name) {
      void switchChain(currentChain);
    }
  }, [activeChain, currentChain, switchChain]);
};

export default useCheckAndSwitchToActiveChain;
