"use client";

/**
 * This hook will automatically check and switch chains when needed
 * This is a client component that will be rendered in the root layout
 */
import { useCheckAndSwitchToActiveChain } from "@/hooks";

export function ChainConnector({ children }: { children: React.ReactNode }) {
  useCheckAndSwitchToActiveChain();
  return <>{children}</>;
}
