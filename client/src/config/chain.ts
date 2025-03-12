import { sepolia, mainnet, localhost, type Chain } from "thirdweb/chains";

/**
 * Chain configuration for the application
 * Supports switching between mainnet, testnet, and local development environments
 * based on environment variables
 */

// Environment variable that determines which network to use
// Can be "mainnet", "testnet", or "localhost"
const NEXT_PUBLIC_NETWORK = process.env.NEXT_PUBLIC_NETWORK ?? "sepolia";

/**
 * Get the appropriate chain based on the environment configuration
 * @returns The Chain object to be used throughout the application
 */
export function getActiveChain(): Chain {
  switch (NEXT_PUBLIC_NETWORK) {
    case "mainnet":
      return mainnet;
    case "sepolia":
      return sepolia;
    case "localhost":
      return localhost;
    default:
      console.warn(
        `Unknown network: ${NEXT_PUBLIC_NETWORK}, defaulting to Sepolia testnet`,
      );
      return sepolia;
  }
}
            
export const activeChain = getActiveChain();

export const isDevelopment = () =>
  NEXT_PUBLIC_NETWORK === "localhost" || process.env.NODE_ENV === "development";

export const isTestnet = () =>
  NEXT_PUBLIC_NETWORK === "sepolia" || activeChain.testnet === true;

export const isMainnet = () =>
  NEXT_PUBLIC_NETWORK === "mainnet" && activeChain.testnet !== true;

export const getRpcUrl = (): string => {
  const defaultRpc = activeChain.rpc[0]!;

  return process.env.NEXT_PUBLIC_RPC_URL ?? defaultRpc;
};
