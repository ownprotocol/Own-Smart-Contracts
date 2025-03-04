import { parseEther } from "viem";
import { ownTestingAPI } from "../../helpers/testing-api";
import { OwnContract, StakeContract, Signers, VeOWN } from "../../types";
import { expect } from "chai";

import { differenceInDays, subDays } from "date-fns";
import { getCurrentBlockTimestamp } from "../../helpers/evm";

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
});
