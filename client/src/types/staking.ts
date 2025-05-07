import { z } from "zod";

export const stakingSchema = z.object({
  tokenAmount: z
    .number()
    .min(1, { message: "Token amount must be more than 0 to stake." }),
  lockupDurationWeeks: z
    .number()
    .min(1, { message: "Lockup duration must be at least 1 week." }),
});

export type StakingFormData = z.infer<typeof stakingSchema>;

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
