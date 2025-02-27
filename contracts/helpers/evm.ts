import hre from "hardhat";
import { convertTimestampToRoundedDownDay } from "../constants/duration";

export const increaseTime = async (seconds: number) => {
  await hre.ethers.provider.send("evm_increaseTime", [seconds]);
  await hre.network.provider.request({
    method: "evm_mine",
  });
};

export const getCurrentBlockTimestamp = async () => {
  return (await hre.ethers.provider.getBlock("latest"))!.timestamp;
};

export const getCurrentDay = async () => {
  const currentTimestamp = await getCurrentBlockTimestamp();

  return convertTimestampToRoundedDownDay(currentTimestamp);
};
