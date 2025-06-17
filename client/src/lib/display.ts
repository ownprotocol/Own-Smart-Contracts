import { MAX_DECIMALS } from "@/constants/decimals";
import { formatEther } from "viem";

// This function takes in an amount either as a number or bigint and returns a string
// Representing the amount in ETH with the appropriate number of decimal places and in a human readable format
// If the amount is less than the smallest displayable amount (but not 0), it returns something like "< 0.000001"
export const displayedEthAmount = (
  amount: number | bigint,
  decimals = MAX_DECIMALS,
): string => {
  if (typeof amount === "bigint") {
    amount = Number(formatEther(amount));
  }

  const minDisplayableAmount = Math.pow(10, -decimals);

  if (amount === 0) {
    return "0";
  }

  if (amount < minDisplayableAmount) {
    return `< ${minDisplayableAmount.toFixed(decimals)}`;
  }

  return amount.toFixed(decimals);
};
