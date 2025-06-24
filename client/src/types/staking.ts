import { z } from "zod";
import { createLockupDurationSchema, createTokenAmountSchema } from "@/lib/schemas";

export const createStakingSchema = (maxBalance: number) => z.object({
  tokenAmount: createTokenAmountSchema(maxBalance, 0, "Token amount"),
  lockupDurationWeeks: createLockupDurationSchema(),
});

export type StakingFormData = z.infer<ReturnType<typeof createStakingSchema>>;

export type StakingPurchaseDetails = {
  positionId: number;
  startDay: number;
  finalDay: number;
  ownAmount: number;
  veOwnAmount: number;
  lastWeekRewardsClaimed: number;
  rewardsClaimed: number;
  claimableRewards: number;
  status: "in-progress" | "finished" | "complete";
};
