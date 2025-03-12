import hre from "hardhat";
import { parseEther } from "ethers";
import { getContractInstances } from "../helpers/testing-api";
import { getCurrentBlockTimestamp, increaseTime } from "../helpers/evm";

// npx hardhat run --network localhost scripts/evm.ts
const main = async () => {
  const beforetime = await getCurrentBlockTimestamp();

  await increaseTime(1000);

  const currentTime = await getCurrentBlockTimestamp();

  const timeDiff = currentTime - beforetime;

  console.log(`Time difference: ${timeDiff}`);
  console.log(`Current time: ${currentTime}`);
  console.log(`Before time: ${beforetime}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
