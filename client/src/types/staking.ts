import { z } from "zod";
import { createStakeValidationSchema, FieldType } from "@/lib/schemas";

export const createStakingSchema = (maxBalance: number) => z.object({
  tokenAmount: createStakeValidationSchema(FieldType.TOKEN_AMOUNT, maxBalance, 0, "Token amount"),
  lockupDurationWeeks: createStakeValidationSchema(FieldType.LOCKUP_DURATION, 52, 1, "Lockup duration"),
});

export type StakingFormData = z.infer<ReturnType<typeof createStakingSchema>>;

export type StakingPurchaseDetails = {
  positionId: number;
  startDay: number;
  finalDay: number;
  finalDayOfFinalWeek: number;
  ownAmount: number;
  veOwnAmount: number;
  lastWeekRewardsClaimed: number;
  rewardsClaimed: number;
  claimableRewards: number;
  status: "in-progress" | "finished" | "complete";
  currentDay: number;
  totalActiveVeOwnSupply: number;
  dailyRewardAmount: number;
  currentBoostMultiplier: number;
};
