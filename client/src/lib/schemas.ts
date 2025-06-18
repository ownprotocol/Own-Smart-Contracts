import { z } from "zod";

/**
 * Reusable token amount validation schema that handles decimal input properly
 * Accepts both strings and numbers, transforms strings to numbers, and validates range
 */
export const createTokenAmountSchema = (
  maxAmount: number,
  minAmount = 0,
  fieldName = "Token amount",
) => {
  return z
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
    .refine(
      (val) => val > minAmount,
      `${fieldName} must be more than ${minAmount}.`,
    )
    .refine(
      (val) => val <= maxAmount,
      `Cannot exceed ${maxAmount.toFixed(2)} tokens`,
    );
};
