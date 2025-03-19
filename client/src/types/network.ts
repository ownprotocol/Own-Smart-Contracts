export const SUPPORTED_NETWORKS = ["Localhost", "Sepolia", "Ethereum"] as const;

export type Network = (typeof SUPPORTED_NETWORKS)[number];

