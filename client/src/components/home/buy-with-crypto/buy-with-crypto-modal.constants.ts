import { z } from "zod";

export const buyWithCryptoSchema = z.object({
  tokenAmount: z
    .string()
    .min(1, { message: "Token amount must be more than 0 to stake." })
    .regex(/^\d+(\.\d+)?$/, {
      message: "Token amount must contain only numbers.",
    }),
});

export type StakingFormData = z.infer<typeof buyWithCryptoSchema>;

export interface BuyWithCryptoForm {
  tokenAmount: string;
}
