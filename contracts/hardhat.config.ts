import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "hardhat-chai-matchers-viem";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-deploy";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const infuraApiKey = process.env.INFURA_API_KEY;
const mnemonic = process.env.MNEMONIC;
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${infuraApiKey}`,
      chainId: 11155111,
      accounts: {
        mnemonic,
      },
    },
    hardhat: {
      chainId: 1337,
    },
  },
  etherscan: {
    apiKey: etherscanApiKey,
  },
};

export default config;
