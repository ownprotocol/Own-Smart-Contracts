import { SupportedNetworkIds } from "@fasset/contracts";

const BlockExplorerUrls: Record<SupportedNetworkIds, string> = {
  [1337]: "https://localhost:3000",
};

export const getBlockExplorerTxUrl = (
  txHash: string,
  networkId: SupportedNetworkIds,
) => {
  return `${BlockExplorerUrls[networkId]}/tx/${txHash}`;
};
