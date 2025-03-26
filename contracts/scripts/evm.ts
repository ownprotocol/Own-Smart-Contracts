import { getCurrentBlockTimestamp, increaseTime } from "../helpers/evm";

// npx hardhat run ./scripts/evm.ts --network localhost
const main = async () => {
  const beforetime = await getCurrentBlockTimestamp();

  await increaseTime(604800 * 2);

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
