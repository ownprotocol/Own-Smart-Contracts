"use client";

import { NetworkSwitchDialog } from "@/components";
import { MAIN_CHAIN } from "@/config/contracts";
import { useCheckAndSwitchToActiveChain } from "@/hooks";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, type ReactNode } from "react";

interface ChainSwitchContextValue {
  needsSwitch?: boolean;
  switchToCorrectChain: () => Promise<void>;
  currentAppChain: typeof MAIN_CHAIN;
}

const ChainSwitchContext = createContext<ChainSwitchContextValue | undefined>(
  undefined,
);

export function ChainSwitchProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { needsSwitch, switchToCorrectChain, currentAppChain } =
    useCheckAndSwitchToActiveChain();

  const handleDialogClose = () => {
    router.push("/");
  };

  const value = {
    needsSwitch,
    switchToCorrectChain,
    currentAppChain: MAIN_CHAIN,
  };

  return (
    <ChainSwitchContext.Provider value={value}>
      {children}
      {needsSwitch && (
        <NetworkSwitchDialog
          title={`Switch to view your rewards on ${currentAppChain?.name}`}
          isOpen={needsSwitch}
          onClose={handleDialogClose}
          onSwitch={switchToCorrectChain}
          networkName={currentAppChain?.name ?? ""}
        />
      )}
    </ChainSwitchContext.Provider>
  );
}

export function useChainSwitch(): ChainSwitchContextValue {
  const context = useContext(ChainSwitchContext);
  if (context === undefined) {
    throw new Error("useChainSwitch must be used within a ChainSwitchProvider");
  }
  return context;
}

export default ChainSwitchProvider;
