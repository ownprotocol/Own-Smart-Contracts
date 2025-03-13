export const USDTAddress = "0xBC4e5986e9d76C6f32CE37C4991dC4160f047D82";

export const PresaleAddress = "0x59dA58dcAA1FBc65D5efe4F67BC4A746807C8043";

export const StakeAddress = "0xb66dA146c4EeD81390815382Af5d259238347FA1";

export const OwnTokenAddress = "0xBbB541c3cfB1093497cB2333B4fc01802c332f69";

export const veOwnTokenAddress = "0x31307591ab5b5fB4E604628B895a207E6125821F";

interface ContractAddresses {
  usdtAddress: string;
  presaleAddress: string;
  stakeAddress: string;
  ownTokenAddress: string;
  veOwnTokenAddress: string;
  }

export const getContractAddresses = (network: "localhost" | "sepolia" | "mainnet"): ContractAddresses => {
  if (network === "localhost") {
    return {
      usdtAddress: "0x",
      presaleAddress: "0x",
      stakeAddress: "0x",
      ownTokenAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      veOwnTokenAddress: "0x",
    };
  }

  if (network === "sepolia") {
    return {
      usdtAddress: USDTAddress,
      presaleAddress: PresaleAddress,
      stakeAddress: StakeAddress,
      ownTokenAddress: OwnTokenAddress,
      veOwnTokenAddress: veOwnTokenAddress,
    };
  }

  throw new Error(`Unknown network: ${network}`);
}
