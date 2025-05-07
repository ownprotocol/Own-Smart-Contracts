import { deployments, network } from "hardhat";

export const isTestNetwork = () => {
  if (network.name === "sepolia" || network.name === "hardhat") {
    return true;
  }
};
