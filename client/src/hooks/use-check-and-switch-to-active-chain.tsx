import { getActiveChain } from "@/config/chain";
import { useSwitchActiveWalletChain } from "thirdweb/react";
import { useActiveWalletChain } from "thirdweb/react";

/**
 * This hook checks if the active chain is different from the app's configured chain
 * and returns a function to switch to the correct chain if needed.
 * @returns {Object} An object containing:
 * - needsSwitch: boolean indicating if chain switch is needed
 * - switchToCorrectChain: function to switch to the correct chain
 * - isValid: boolean indicating if the user is authenticated
 */

export const useCheckAndSwitchToActiveChain = (isValid = false) => {
  const activeChain = useActiveWalletChain();
  const currentAppChain = getActiveChain();
  const switchChain = useSwitchActiveWalletChain();

  const needsSwitch =
    isValid && activeChain && activeChain.name !== currentAppChain.name;

  const switchToCorrectChain = async () => {
    if (needsSwitch) {
      await switchChain(currentAppChain);
    }
  };

  return {
    needsSwitch,
    switchToCorrectChain,
    currentAppChain,
  };
};

export default useCheckAndSwitchToActiveChain;
