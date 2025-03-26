import { HARDHAT_CHAIN_ID } from "@/constants/network";
import { sepolia } from "thirdweb/chains";

export interface ContractAddresses {
  usdtAddress: string;
  presaleAddress: string;
  stakeAddress: string;
  ownTokenAddress: string;
  veOwnTokenAddress: string;
}

export const getContractAddresses = (networkId: number): ContractAddresses => {
  if (networkId === HARDHAT_CHAIN_ID) {
    return {
      usdtAddress: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
      presaleAddress: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
      stakeAddress: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
      ownTokenAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      veOwnTokenAddress: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    };
  }

  if (networkId === 11155111) {
    return {
      usdtAddress: "0xD870f592AAeB2F3DA261a8e822F6Cf24196E4277",
      presaleAddress: "0xd020E4743c6fe4DC47ed7E1AA6766B1F24C0Ad7a",
      stakeAddress: "0x7c04235999699AaBbf6eF0063B386BA9BE6aa67e",
      ownTokenAddress: "0xA9811778255599459638e32992550CDE9C83C208",
      veOwnTokenAddress: "0xd0c1F09267b4cB7f4823F1873d40A724FcB0443b",
    };
  }

  throw new Error(`Unknown network: ${networkId}`);
};

// The default network we are using
// TODO: Change to mainnet for deployment
export const MAIN_CHAIN = sepolia;
