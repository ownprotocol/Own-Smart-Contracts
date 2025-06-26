import { z } from "zod";

/**
 * Reusable token amount validation schema that handles decimal input properly
 * Accepts both strings and numbers, transforms strings to numbers, and validates range
 */

export enum FieldType {
  TOKEN_AMOUNT = "TOKEN_AMOUNT",
  LOCKUP_DURATION = "LOCKUP_DURATION",
}

export const  createStakeValidationSchema = (
  fieldType: FieldType,
  max: number,
  min = 0,
  fieldName: string,
) => {
  const isTokenAmount = fieldType === FieldType.TOKEN_AMOUNT;
  const isLockupDuration = fieldType === FieldType.LOCKUP_DURATION;

  return z
  .union([z.string(), z.number()])
  .refine((val) => {
    if (typeof val === "string") {
      if (val === "") return true;
      if (val === "." && isTokenAmount) return true;

      if (isTokenAmount) {
        // Valid: "123", "123.45", ".5", "0.1", "+10"
        const validNumberPattern = /^[+-]?(\d+\.?\d*|\.\d+)$/;
        return validNumberPattern.test(val);
      } else {
        // Valid: "52" (integers only for lockup duration)
        const validWeeksPattern = /^\d+$/;
        return validWeeksPattern.test(val);
      }
    }
    return true; // numbers are always valid
  }, isTokenAmount ? "You must input valid amount." : "You must input valid number of weeks.")
  .transform((val) => {
    if (typeof val === "string") {
      if (val === "" || (val === "." && isTokenAmount)) return 0;
      const num = isTokenAmount ? parseFloat(val) : parseInt(val, 10);
      return isNaN(num) ? 0 : num;
    }
    return val;
  })
  .refine(
    (val) => isTokenAmount ? val > min : val >= min,
    isTokenAmount 
      ? `${fieldName} must be more than ${min}.`
      : `${fieldName} must be at least ${min} ${isLockupDuration ? 'weeks' : ''}.`,
  )
  .refine(
    (val) => val <= max,
    isTokenAmount 
      ? `Cannot exceed ${max.toFixed(2)} tokens`
      : `${fieldName} cannot be more than ${max} ${isLockupDuration ? 'weeks (1 year)' : ''}.`,
  );
};
