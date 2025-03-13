import { sepolia, mainnet, localhost, type Chain } from "thirdweb/chains";


/**
 * Chain configuration for the application
 * Supports switching between Sepolia, Ethereum, and Localhost
 * based on environment variables
 * chain name: Sepolia, Ethereum, Localhost
 */

// Environment variable that determines which network to use
// Can be "Ethereum", "Sepolia", or "Localhost"
const NEXT_PUBLIC_NETWORK = process.env.NEXT_PUBLIC_NETWORK ?? "Sepolia";

/**
 * Get the appropriate chain based on the environment configuration
 * @returns The Chain object to be used throughout the application
 */
export function getActiveChain(): Chain {
  switch (NEXT_PUBLIC_NETWORK) {
    case "Ethereum":
      return mainnet;
    case "Sepolia":
      return sepolia;
    case "Localhost":
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
  NEXT_PUBLIC_NETWORK === "Localhost" || process.env.NODE_ENV === "development";

export const isTestnet = () =>
  NEXT_PUBLIC_NETWORK === "Sepolia" || activeChain.testnet === true;

export const isMainnet = () =>
  NEXT_PUBLIC_NETWORK === "Ethereum" && activeChain.testnet !== true;

export const getRpcUrl = (): string => {
  const defaultRpc = activeChain.rpc[0]!;

  return process.env.NEXT_PUBLIC_RPC_URL ?? defaultRpc;
};
