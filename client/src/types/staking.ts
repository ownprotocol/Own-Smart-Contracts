import { z } from "zod";
import { createTokenAmountSchema } from "@/lib/schemas";

export const createStakingSchema = (maxBalance: number) => z.object({
  tokenAmount: createTokenAmountSchema(maxBalance, 0, "Token amount"),
  lockupDurationWeeks: z
    .number()
    .min(1, { message: "Lockup duration must be at least 1 week." }),
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
