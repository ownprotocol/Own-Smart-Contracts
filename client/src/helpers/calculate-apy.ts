import { type StakingPurchaseDetails } from "@/types";

const DAYS_IN_YEAR = 365;
/**
 * Calculates the Annual Percentage Yield (APY) for a staking position
 * @param position The staking position details including amounts and timing
 * @param totalActiveVeOwnSupply Total active veOWN supply in the system
 * @param dailyRewardAmount Daily reward amount distributed
 * @param currentBoostMultiplier Current boost multiplier applied to rewards
 * @returns The calculated APY
 */
export const calculateApy = (
  position: StakingPurchaseDetails,
  totalActiveVeOwnSupply: number,
  dailyRewardAmount: number,
  currentBoostMultiplier: number,
) => {
  const totalYearlyRewards =
    dailyRewardAmount * currentBoostMultiplier * DAYS_IN_YEAR;
  const rewardsEarnedForPositionForYear =
    (position.veOwnAmount / totalActiveVeOwnSupply) * totalYearlyRewards;

  const apy = rewardsEarnedForPositionForYear / position.ownAmount;
  return apy * 100;
};
