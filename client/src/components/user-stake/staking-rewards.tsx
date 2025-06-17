"use client";

import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { type StakingPurchaseDetails } from "@/types";
import RewardBox from "../reward-box";
import { useActiveAccount } from "thirdweb/react";
import { useContracts } from "@/hooks/use-contracts";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import Image from "next/image";
import { displayedEthAmount } from "@/lib/display";

interface StakingRewardsProps {
  stakePositions: StakingPurchaseDetails[];
  refetch: () => Promise<void>;
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

      await refetch();

      toast.success("Rewards claimed successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to claim rewards");
    }
  };
  return (
    <div className="mt-4 grid grid-cols-2 gap-6 rounded-xl md:mt-8 md:grid-cols-3 md:gap-12">
      {/* <RewardBox label="$OWN Received" value="10,000" /> */}
      <RewardBox
        label="Rewards Earned"
        value={displayedEthAmount(totalRewardsClaimed)}
      />
      <ClaimableRewardBox
        label="Claimable Rewards"
        value={displayedEthAmount(totalClaimableRewards)}
        onClaim={claimRewards}
        disabled={disabled}
      />
      <Button
        variant="mainButton"
        size="lg"
        onClick={claimRewards}
        disabled={disabled}
        useSpinner
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

      return {
        totalRewardsClaimed:
          stats.totalRewardsClaimed + position.rewardsClaimed,
        totalClaimableRewards:
          stats.totalClaimableRewards + position.claimableRewards,
        claimablePositionIds: stats.claimablePositionIds,
      };
    },
    {
      totalRewardsClaimed: 0,
      totalClaimableRewards: 0,
      claimablePositionIds: [] as number[],
    },
  );
}

interface ClaimableRewardBoxProps {
  label: string;
  value: string | number;
  onClaim: () => Promise<void>;
  disabled?: boolean;
}

function ClaimableRewardBox({
  label,
  value,
  onClaim,
  disabled,
}: ClaimableRewardBoxProps) {
  return (
    <div className="flex flex-col items-center space-y-1 md:items-start md:space-y-0">
      <span className="w-full text-left font-dm_mono text-[12px] uppercase leading-[12px] tracking-[8%] text-gray-400 md:text-[14px] md:leading-[14px]">
        {label}
      </span>
      <div className="flex w-full items-center gap-2 pt-2 md:pt-4">
        <div className="flex items-center gap-2">
          <Image
            src="/own-logo.svg"
            alt="OWN"
            width={24}
            height={24}
            className="rounded-full"
          />
          <span className="font-dm_sans text-[22px] font-[500] leading-[22px] tracking-[2%] text-white md:text-[32px] md:leading-[32px]">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}

export default StakingRewards;
