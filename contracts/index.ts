import OwnLocalhostDeployment from "./deployments/localhost/Own.json";
import VeOwnLocalhostDeployment from "./deployments/localhost/VeOwn.json";
import mockUSDTLocalhostDeployment from "./deployments/localhost/mockUSDT.json";
import presaleLocalhostDeployment from "./deployments/localhost/presale.json";
import stakeLocalhostDeployment from "./deployments/localhost/stake.json";

export interface ContractAddresses {
  usdtAddress: string;
  presaleAddress: string;
  stakeAddress: string;
  ownTokenAddress: string;
  veOwnTokenAddress: string;
}

export type SupportedNetworkIds = 1337;

export function getContractAddresses(
  networkId: SupportedNetworkIds
): ContractAddresses {
  if (networkId !== 1337) {
    throw new Error(`Unsupported network: ${networkId}`);
  }

  return {
    usdtAddress: mockUSDTLocalhostDeployment.address,
    presaleAddress: presaleLocalhostDeployment.address,
    stakeAddress: stakeLocalhostDeployment.address,
    ownTokenAddress: OwnLocalhostDeployment.address,
    veOwnTokenAddress: VeOwnLocalhostDeployment.address,
  };
}
