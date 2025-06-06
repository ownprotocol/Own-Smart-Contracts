import { SECONDS_IN_A_WEEK } from "../constants/duration";
import { getCurrentBlockTimestamp, increaseTime } from "../helpers/evm";

// npx hardhat run ./scripts/fast_forward_time.ts --network localhost
const main = async () => {
  const beforetime = await getCurrentBlockTimestamp();

  await increaseTime(SECONDS_IN_A_WEEK * 5);

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
