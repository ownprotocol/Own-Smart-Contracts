import { z } from "zod";

export const buyWithCryptoSchema = (maxAllocation: number) => z.object({
  tokenAmount: z
    .string()
    .min(1, { message: "Token amount must be more than 0 to stake." })
      .regex(/^\d+(\.\d+)?$/, {
        message: "Token amount must contain only numbers.",
      })
      .max(maxAllocation, {
        message: `Maximum allocation is ${maxAllocation}`,
      }),
  });

export type BuyWithCryptoFormData = z.infer<ReturnType<typeof buyWithCryptoSchema>>;

export interface BuyWithCryptoForm {
  tokenAmount: string;
}
