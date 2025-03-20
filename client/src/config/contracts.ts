import { sepolia } from "thirdweb/chains";

export interface ContractAddresses {
  usdtAddress: string;
  presaleAddress: string;
  stakeAddress: string;
  ownTokenAddress: string;
  veOwnTokenAddress: string;
}

export const getContractAddresses = (networkId: number): ContractAddresses => {
  if (networkId === 1337) {
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
      usdtAddress: "0x6DE70A1A954811a03963Aa843347488FE94D417f",
      presaleAddress: "0x20D811217C46419909e8d3887C93A3A7E3Ba5ba7",
      stakeAddress: "0xfA11095Eb3133C367Acc86F716675B6b6Bcf4905",
      ownTokenAddress: "0x9F12BCfAEf51eC22d194bBecD271D8DA28774F80",
      veOwnTokenAddress: "0xe5ACbB48c524bc1Dc30d526aF9f644a0443F5438",
    };
  }

  throw new Error(`Unknown network: ${networkId}`);
};

// The default network we are using
// TODO: Change to mainnet for deployment
export const MAIN_CHAIN = sepolia;
