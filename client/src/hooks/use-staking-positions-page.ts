import { queryHookUnifier } from "@/helpers/query-hook-unifier";
import { useReadContractQueryHook } from "@/helpers/useReadContractWithParsing";
import { useContracts } from "./use-contracts";
import { useActiveAccount } from "thirdweb/react";
import { type StakingPurchaseDetails } from "@/types";
import { formatEther } from "viem";

export const useStakingPositionsPage = () => {
  const { stakeContract } = useContracts();
  const account = useActiveAccount();

  return queryHookUnifier({
    stakingPositions: useReadContractQueryHook(
      {
        contract: stakeContract,
        method: "getUsersPositionDetails",
        params: [account?.address ?? ""],
      },
      ([userPositions, claimableRewards]) =>
        userPositions.map(
          (row, idx): StakingPurchaseDetails => ({
            ownAmount: Number(formatEther(row.ownAmount)),
            finalDay: Number(row.finalDay),
            startDay: Number(row.startDay),
            lastWeekRewardsClaimed: Number(row.lastWeekRewardsClaimed),
            rewardsClaimed: Number(formatEther(row.rewardsClaimed)),
            veOwnAmount: Number(formatEther(row.veOwnAmount)),
            claimableRewards: Number(
              // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
              formatEther(claimableRewards[idx] as bigint),
            ),
            positionId: Number(row.positionId),
          }),
        ),
    ),
  });
};
