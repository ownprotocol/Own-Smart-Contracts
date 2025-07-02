import { type StakingPurchaseDetails } from "@/types";

/**
 * 
 * @param positions 
 * @returns totalOwnStaked, totalRewardsClaimed, totalClaimableRewards, claimablePositionIds, claimablePrincipalAmount
 */
export function calculateStakingStats(positions: StakingPurchaseDetails[]) {
  return positions.reduce(
    (stats, position) => {
      if (position.claimableRewards > 0) {
        stats.claimablePositionIds.push(position.positionId);
      }
      const claimablePrincipalAmount =
        position.status === "finished" ? position.ownAmount : 0;

      return {
        totalOwnStaked: stats.totalOwnStaked + position.ownAmount,
        totalRewardsClaimed:
          stats.totalRewardsClaimed + position.rewardsClaimed,
        totalClaimableRewards:
          stats.totalClaimableRewards + position.claimableRewards,
        claimablePositionIds: stats.claimablePositionIds,
        claimablePrincipalAmount:
          stats.claimablePrincipalAmount + claimablePrincipalAmount,
      };
    },
    {
      totalOwnStaked: 0,
      totalRewardsClaimed: 0,
      totalClaimableRewards: 0,
      claimablePositionIds: [] as number[],
      claimablePrincipalAmount: 0,
    },
  );
}
