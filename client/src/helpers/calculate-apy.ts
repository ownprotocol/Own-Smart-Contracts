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
  currentDay: number,
) => {
  if (position.finalDay > currentDay) {
    const totalRewardsEarned =
      position.rewardsClaimed + position.claimableRewards;
    const adjustedStakingDuraton =
      DAYS_IN_YEAR / (position.finalDay - position.startDay);
    const adjustedRewardsEarned = totalRewardsEarned * adjustedStakingDuraton;
    const apy = adjustedRewardsEarned / position.ownAmount;
    return apy;
  } else {
    const totalYearlyRewards =
      dailyRewardAmount * currentBoostMultiplier * DAYS_IN_YEAR;
    const rewardsEarnedForPositionForYear =
      (position.veOwnAmount / totalActiveVeOwnSupply) * totalYearlyRewards;
    const apy = rewardsEarnedForPositionForYear / position.ownAmount;
    return apy;
  }
};
