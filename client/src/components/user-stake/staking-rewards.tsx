"use client";

import { type StakingPurchaseDetails } from "@/types";
import RewardBox from "../reward-box";

interface StakingRewardsProps {
  stakePositions: StakingPurchaseDetails[];
}

function StakingRewards({ stakePositions }: StakingRewardsProps) {
  console.log(stakePositions);

  const { totalRewardsClaimed, totalClaimableRewards } = calculateTotalRewards(stakePositions);

  return (
    <div className="mt-4 grid grid-cols-2 gap-6 rounded-xl bg-[#111111] md:mt-8 md:grid-cols-3 md:gap-12">
      {/* <RewardBox label="$OWN Received" value="10,000" /> */}
      <RewardBox label="Rewards Earned" value={totalRewardsClaimed} />
      <RewardBox
        label="Claimable Rewards"
        value={totalClaimableRewards}
        isClaimable
        showLogo
        onClaim={() => {
          console.log("Claiming rewards");
          //TODO: Implement claim logic here
        }}
      />
    </div>
  );
}

function calculateTotalRewards(positions: StakingPurchaseDetails[]) {
  return positions.reduce(
    (totals, position) => ({
      totalRewardsClaimed: totals.totalRewardsClaimed + position.rewardsClaimed,
      totalClaimableRewards:
        totals.totalClaimableRewards + position.claimableRewards,
    }),
    { totalRewardsClaimed: 0, totalClaimableRewards: 0 },
  );
}

export default StakingRewards;
