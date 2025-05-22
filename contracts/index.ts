// Using static imports here, would prefer to use the fs module but it causes runtime errors on the frontend

import OwnLocalhostDeployment from "./deployments/localhost/Own.json";
import VeOwnLocalhostDeployment from "./deployments/localhost/VeOwn.json";
import mockUSDTLocalhostDeployment from "./deployments/localhost/mockUSDT.json";
import presaleLocalhostDeployment from "./deployments/localhost/presale.json";
import stakeLocalhostDeployment from "./deployments/localhost/stake.json";

import OwnSepoliaDeployment from "./deployments/sepolia/Own.json";
import VeOwnSepoliaDeployment from "./deployments/sepolia/VeOwn.json";
import mockUSDTSepoliaDeployment from "./deployments/sepolia/mockUSDT.json";
import presaleSepoliaDeployment from "./deployments/sepolia/presale.json";
import stakeSepoliaDeployment from "./deployments/sepolia/stake.json";

export interface ContractAddresses {
  usdtAddress: string;
  presaleAddress: string;
  stakeAddress: string;
  ownTokenAddress: string;
  veOwnTokenAddress: string;
}

export const SUPPORTED_NETWORK_IDS = [1337, 11155111] as const;

export type SupportedNetworkIds = (typeof SUPPORTED_NETWORK_IDS)[number];

export function getContractAddresses(
  networkId: SupportedNetworkIds,
): ContractAddresses {
  if (networkId === 1337) {
    return {
      usdtAddress: mockUSDTLocalhostDeployment.address,
      presaleAddress: presaleLocalhostDeployment.address,
      stakeAddress: stakeLocalhostDeployment.address,
      ownTokenAddress: OwnLocalhostDeployment.address,
      veOwnTokenAddress: VeOwnLocalhostDeployment.address,
    };
  }

  if (networkId === 11155111) {
    return {
      usdtAddress: mockUSDTSepoliaDeployment.address,
      presaleAddress: presaleSepoliaDeployment.address,
      stakeAddress: stakeSepoliaDeployment.address,
      ownTokenAddress: OwnSepoliaDeployment.address,
      veOwnTokenAddress: VeOwnSepoliaDeployment.address,
    };
  }

  throw new Error(`Unsupported network: ${networkId}`);
}
