import { z } from "zod";

export const stakingSchema = (maxAllocation: number) =>
  z.object({
    tokenAmount: z
      .number()
      .min(1, { message: "Token amount must be more than 0 to stake." })
      .max(maxAllocation, {
        message: `Maximum allocation is ${maxAllocation}`,
      }),
    lockupDurationWeeks: z
      .number()
      .min(1, { message: "Lockup duration must be at least 1 week." }),
  });

export type StakingFormData = z.infer<ReturnType<typeof stakingSchema>>;

export type StakingPurchaseDetails = {
  positionId: number;
  startDay: number;
  finalDay: number;
  ownAmount: number;
  veOwnAmount: number;
  lastWeekRewardsClaimed: number;
  rewardsClaimed: number;
  claimableRewards: number;
};
