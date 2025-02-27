import { parseEther } from "viem";
import { ownTestingAPI } from "../../helpers/testing-api";
import { OwnContract, StakeContract, Signers, VeOWN } from "../../types";
import { expect } from "chai";

import { differenceInDays } from "date-fns";
import { getCurrentBlockTimestamp } from "../../helpers/evm";

function getDaysSinceFirstSaturday(blockTimestamp: number) {
  const firstSaturday = new Date(Date.UTC(1970, 0, 3, 0, 0, 0)); // Ensure UTC
  console.log(firstSaturday);
  const now = new Date(blockTimestamp * 1000); // Convert to milliseconds

  return differenceInDays(now, firstSaturday); // Ensure only full days count
}

describe.only("Stake - read methods", async () => {
  let own: OwnContract;
  let stake: StakeContract;
  let signers: Signers;
  let veOwn: VeOWN;

  const dailyRewardAmount = parseEther("5");
  const duration = BigInt(7 * 5);

  beforeEach(async () => {
    ({ stake, own, veOwn, signers } = await ownTestingAPI());
  });

  it("Should return the current day correctly", async () => {
    const currentTime = await getCurrentBlockTimestamp();
    const currentDay = await stake.read.getCurrentDay();
    expect(currentDay).to.equal(getDaysSinceFirstSaturday(currentTime));
  });
});
