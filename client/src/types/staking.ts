import { z } from "zod";

export const stakingSchema = z.object({
  tokenAmount: z
    .string()
    .min(1, { message: "Token amount must be more than 0 to stake." })
    .regex(/^\d+(\.\d+)?$/, {
      message: "Token amount must contain only numbers.",
    }),
  lockupDuration: z
    .string()
    .min(1, { message: "Lockup duration must be at least 1 week." })
    .regex(/^\d+(\.\d+)?$/, {
      message: "Lockup duration must contain only numbers.",
    }),
});

export type StakingFormData = z.infer<typeof stakingSchema>;
