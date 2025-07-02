import { type StakingPurchaseDetails } from "@/types";

export const calculateApy = (
  position: StakingPurchaseDetails,
  totalActiveVeOwnSupply: number,
  dailyRewardAmount: number,
  currentBoostMultiplier: number,
) => {
  const DAYS_IN_YEAR = 365;
  if (position.finalDay > position.currentDay) {
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
