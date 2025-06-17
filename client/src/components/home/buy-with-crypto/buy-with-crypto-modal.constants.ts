import { z } from "zod";
import { createTokenAmountSchema } from "@/lib/schemas";

export const buyWithCryptoSchema = (maxAllocation: number) => z.object({
  tokenAmount: createTokenAmountSchema(maxAllocation, 0, "Token amount"),
});

export type BuyWithCryptoFormData = z.infer<ReturnType<typeof buyWithCryptoSchema>>;

export interface BuyWithCryptoForm {
  tokenAmount: number;
}
