import hre from "hardhat";
import { parseEther } from "ethers";

const main = async () => {
  await ownTestingAPI();
  // const stake = await hre.viem.getContractAt(
  //   "Stake",
  //   "0x529cad80eb5839772e43bcbe20498f2792b58bb5" as `0x${string}`,
  // );
  //
  // // This is nonsensical, for whatever reason on the deployed sepolia version it has inverted the durationInWeeks and startWeek variables
  // // So this array has flipped the values
  // await stake.write.addBoostDetails([
  //   [
  //     {
  //       durationInWeeks: BigInt(0),
  //       startWeek: BigInt(1),
  //       multiplier: parseEther("10"),
  //     },
  //     {
  //       startWeek: BigInt(3),
  //       durationInWeeks: BigInt(1),
  //       multiplier: parseEther("5"),
  //     },
  //     {
  //       startWeek: BigInt(8),
  //       durationInWeeks: BigInt(4),
  //       multiplier: parseEther("3"),
  //     },
  //   ],
  // ]);
  //
  // const values = await stake.read.getCurrentBoostMultiplier();
  // console.log(values);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
