"use client";

import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { type StakingPurchaseDetails } from "@/types";
import RewardBox from "../reward-box";
import { useActiveAccount } from "thirdweb/react";
import { useContracts } from "@/hooks/use-contracts";
import { toast } from "react-toastify";

interface StakingRewardsProps {
  stakePositions: StakingPurchaseDetails[];
  refetch: () => void;
}

function StakingRewards({ stakePositions, refetch }: StakingRewardsProps) {
  const account = useActiveAccount();
  const { stakeContract } = useContracts();

  const { totalRewardsClaimed, totalClaimableRewards, claimablePositionIds } =
    calculateStakingStats(stakePositions);
  const disabled =
    totalClaimableRewards === 0 ||
    totalClaimableRewards === totalRewardsClaimed;

  const claimRewards = async () => {
    if (!account) {
      console.error("Account not found");
      return;
    }

    try {
      await sendAndConfirmTransaction({
        account,
        transaction: prepareContractCall({
          contract: stakeContract,
          method: "claimRewards",
          params: [claimablePositionIds.map((id) => BigInt(id))],
        }),
      });

      refetch();

      toast.success("Rewards claimed successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to claim rewards");
    }
  };
  return (
    <div className="mt-4 grid grid-cols-2 gap-6 rounded-xl bg-[#111111] md:mt-8 md:grid-cols-3 md:gap-12">
      {/* <RewardBox label="$OWN Received" value="10,000" /> */}
      <RewardBox label="Rewards Earned" value={totalRewardsClaimed} />
      <RewardBox
        label="Claimable Rewards"
        value={totalClaimableRewards.toFixed(2)}
        isClaimable
        showLogo
        onClaim={claimRewards}
        disabled={disabled}
      />
    </div>
  );
}

function calculateStakingStats(positions: StakingPurchaseDetails[]) {
  return positions.reduce(
    (stats, position) => ({
      totalRewardsClaimed: stats.totalRewardsClaimed + position.rewardsClaimed,
      totalClaimableRewards:
        stats.totalClaimableRewards + position.claimableRewards,
      claimablePositionIds:
        position.claimableRewards > 0
          ? [...stats.claimablePositionIds, position.positionId]
          : stats.claimablePositionIds,
    }),
    {
      totalRewardsClaimed: 0,
      totalClaimableRewards: 0,
      claimablePositionIds: [] as number[],
    },
  );
}

export default StakingRewards;
