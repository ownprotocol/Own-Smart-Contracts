"use client";

import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { type StakingPurchaseDetails } from "@/types";
import RewardBox from "../reward-box";
import { useActiveAccount } from "thirdweb/react";
import { useContracts } from "@/hooks/use-contracts";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { displayedEthAmount } from "@/lib/display";
import { calculateStakingStats } from "@/helpers/calculate-staking-stats";

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
               className="bg-black"
        />
        <RewardBox
          label="TOTAL STAKING REWARDS EARNED"
          value={displayedEthAmount(totalStakingRewardsEarned)}
          className="bg-black"
        />
        <RewardBox
          label="CLAIMABLE PRINCIPAL"
          value={displayedEthAmount(claimablePrincipalAmount)}
          className="bg-[#2A2230]"
        />
          <RewardBox
            label="CLAIMABLE REWARDS"
            value={displayedEthAmount(totalClaimableRewards)}
            className="bg-[#2A2230]"
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
        Claim {displayedEthAmount(claimablePrincipalAmount + totalClaimableRewards)}
      </Button>
    </div>
  );
}

export default StakingRewards;
