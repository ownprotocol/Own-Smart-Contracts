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
      usdtAddress: "0xBC4e5986e9d76C6f32CE37C4991dC4160f047D82",
      presaleAddress: "0x59dA58dcAA1FBc65D5efe4F67BC4A746807C8043",
      stakeAddress: "0xb66dA146c4EeD81390815382Af5d259238347FA1",
      ownTokenAddress: "0xBbB541c3cfB1093497cB2333B4fc01802c332f69",
      veOwnTokenAddress: "0x31307591ab5b5fB4E604628B895a207E6125821F",
    };
  }

  throw new Error(`Unknown network: ${networkId}`);
};

// The default network we are using
// TODO: Change to mainnet for deployment
export const MAIN_CHAIN = sepolia;
