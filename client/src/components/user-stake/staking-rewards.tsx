"use client";

import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { type StakingPurchaseDetails } from "@/types";
import RewardBox from "../reward-box";
import { useActiveAccount } from "thirdweb/react";
import { useContracts } from "@/hooks/use-contracts";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { displayedEthAmount } from "@/lib/display";

interface StakingRewardsProps {
  stakePositions: StakingPurchaseDetails[];
  refetch: () => Promise<void>;
}

function StakingRewards({ stakePositions, refetch }: StakingRewardsProps) {
  const account = useActiveAccount();
  const { stakeContract } = useContracts();

  const { totalRewardsClaimed, totalClaimableRewards, claimablePositionIds, claimablePrincipalAmount , totalOwnStaked} =
    calculateStakingStats(stakePositions);

  const totalStakingRewardsEarned = totalRewardsClaimed + totalClaimableRewards;

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

      await refetch();

      toast.success("Rewards claimed successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to claim rewards");
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl md:mt-6 md:gap-2">
        <RewardBox
          label="TOTAL OWN STAKED"
          value={displayedEthAmount(totalOwnStaked)}
        />
        <RewardBox
          label="TOTAL STAKING REWARDS EARNED"
          value={displayedEthAmount(totalStakingRewardsEarned)}
          className=""
        />
        <RewardBox
          label="CLAIMABLE PRINCIPAL"
          value={displayedEthAmount(claimablePrincipalAmount)}
          className="bg-[#2A2234]"
        />
          <RewardBox
            label="CLAIMABLE REWARDS"
            value={displayedEthAmount(totalClaimableRewards)}
            className="bg-[#2A2234]"
          />
      </div>
      <Button
        variant="mainButton"
        size="lg"
        onClick={claimRewards}
        disabled={disabled}
        useSpinner
        className="w-full rounded-2xl bg-[#C58BFF]"
      >
        Claim
      </Button>
    </div>
  );
}

function calculateStakingStats(positions: StakingPurchaseDetails[]) {
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


export default StakingRewards;
