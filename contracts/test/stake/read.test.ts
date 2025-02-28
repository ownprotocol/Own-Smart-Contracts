import { parseEther } from "viem";
import { ownTestingAPI } from "../../helpers/testing-api";
import { OwnContract, StakeContract, Signers, VeOWN } from "../../types";
import { expect } from "chai";

import { differenceInDays, subDays } from "date-fns";
import { getCurrentBlockTimestamp } from "../../helpers/evm";

async function getDaysSinceFirstSaturday() {
  const blockTimestamp = await getCurrentBlockTimestamp();
  const firstSaturday = subDays(new Date(Date.UTC(1970, 0, 1, 0, 0, 0)), 2);
  const now = new Date(blockTimestamp * 1000);

  return differenceInDays(now, firstSaturday);
}

describe("Stake - read methods", async () => {
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
    const currentDay = await stake.read.getCurrentDay();
    expect(currentDay).to.equal(await getDaysSinceFirstSaturday());
  });
});
