import { z } from "zod";

export const createStakingSchema = (maxBalance: number) => z.object({
  tokenAmount: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "string") {
        // Allow empty string or just decimal point while typing
        if (val === "" || val === ".") return 0;
        const num = parseFloat(val);
        return isNaN(num) ? 0 : num;
      }
      return val;
    })
    .refine((val) => val > 0, "Token amount must be more than 0 to stake.")
    .refine((val) => val <= maxBalance, `Cannot stake more than ${maxBalance.toFixed(2)} OWN`),
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
