import { type SupportedNetworkIds } from "@fasset/contracts";

const BlockExplorerUrls: Record<SupportedNetworkIds, string> = {
  [1337]: "https://localhost:3000",
  [11155111]: "https://sepolia.etherscan.io",
};

export const getBlockExplorerTxUrl = (
  txHash: string,
  networkId: SupportedNetworkIds,
) => {
  return `${BlockExplorerUrls[networkId]}/tx/${txHash}`;
};
