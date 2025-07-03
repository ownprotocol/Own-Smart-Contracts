import { type StakingPurchaseDetails } from "@/types";

/**
 * Calculates aggregate statistics across all staking positions
 * @param positions Array of staking position details to analyze
 * @returns Object containing:
 *   - totalOwnStaked: Total tokens staked across all positions
 *   - totalRewardsClaimed: Total rewards already claimed
 *   - totalClaimableRewards: Total rewards available to claim
 *   - claimablePositionIds: Array of position IDs with claimable rewards
 *   - claimablePrincipalAmount: Total principal amount that can be withdrawn from finished positions
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
