import hre from "hardhat";

export const increaseTime = async (seconds: number) => {
  await hre.ethers.provider.send("evm_increaseTime", [seconds]);
  await hre.network.provider.request({
    method: "evm_mine",
  });
};
