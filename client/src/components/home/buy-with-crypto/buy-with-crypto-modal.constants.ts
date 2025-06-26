import { z } from "zod";
import { createStakeValidationSchema, FieldType } from "@/lib/schemas";

export const buyWithCryptoSchema = (maxAllocation: number) => z.object({
  tokenAmount: createStakeValidationSchema(FieldType.TOKEN_AMOUNT, maxAllocation, 0, "Token amount"),
});

export type BuyWithCryptoFormData = z.infer<ReturnType<typeof buyWithCryptoSchema>>;

export interface BuyWithCryptoForm {
  tokenAmount: number;
}
