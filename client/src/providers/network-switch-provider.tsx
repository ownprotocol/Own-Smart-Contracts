"use client";

import { MAIN_CHAIN } from "@/config/contracts";
import { useCheckAndSwitchToActiveChain } from "@/hooks";
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
  const { needsSwitch, switchToCorrectChain } =
    useCheckAndSwitchToActiveChain();

  const value = {
    needsSwitch,
    switchToCorrectChain,
    currentAppChain: MAIN_CHAIN,
  };

  return (
    <ChainSwitchContext.Provider value={value}>
      {children}
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
