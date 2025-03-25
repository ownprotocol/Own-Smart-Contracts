export const SUPPORTED_NETWORKS = ["Localhost", "Sepolia", "Ethereum"] as const;

export type Network = (typeof SUPPORTED_NETWORKS)[number];

export const SUPPORTED_NETWORK_IDS = [1337, 11155111, 1] as const;
