import { queryHookUnifier } from "@/helpers/query-hook-unifier";
import { useReadContractQueryHook } from "@/helpers/useReadContractWithParsing";
import { useContracts } from "./use-contracts";
import { useActiveAccount } from "thirdweb/react";
import { type StakingPurchaseDetails } from "@/types";
import { formatEther } from "viem";
import { useTestingSafeTimestamp } from "./use-testing-safe-timestamp";
import { type QueryHook } from "@/types/query";
import { getDay } from "@/helpers/date";

const getStatus = (
  currentDay: number,
  finalDay: number,
  lastWeekRewardsClaimed: number,
): StakingPurchaseDetails["status"] => {
  if (currentDay <= finalDay) {
    return "in-progress";
  }

  const finalDayOfFinalWeek = Math.floor(finalDay / 7) + 6;

  if (currentDay > finalDayOfFinalWeek) {
    return "finished";
  }

  const finalWeek = Math.floor(finalDay / 7);

  if (
    currentDay > finalDayOfFinalWeek &&
    lastWeekRewardsClaimed === finalWeek
  ) {
    return "complete";
  }

  return "finished";
};

export const useStakingPositionsPage = (): QueryHook<
  StakingPurchaseDetails[]
> => {
  const { stakeContract } = useContracts();
  const account = useActiveAccount();

  const queryHooks = queryHookUnifier({
    stakingPositions: useReadContractQueryHook({
      contract: stakeContract,
      method: "getUsersPositionDetails",
      params: [account?.address ?? ""],
    }),

    dailyRewardAmount: useReadContractQueryHook({
      contract: stakeContract,
      method: "dailyRewardAmount",
      params: [],
    }),
    currentBoostMultiplier: useReadContractQueryHook({
      contract: stakeContract,
      method: "getCurrentBoostMultiplier",
      params: [],
    }),
    totalActiveVeOwnSupply: useReadContractQueryHook({
      contract: stakeContract,
      method: "getTotalActiveVeOwnSupply",
      params: [],
    }),
    timestamp: useTestingSafeTimestamp(),
  });

  if (queryHooks.isLoading) {
    return {
      isLoading: true,
    };
  }

  const [stakingPositions, claimableRewards] = queryHooks.data.stakingPositions;

  const currentDay = getDay(queryHooks.data.timestamp);

  return {
    isLoading: false,
    data: stakingPositions.map(
      (row, idx): StakingPurchaseDetails => ({
        ownAmount: Number(formatEther(row.ownAmount)),
        finalDay: Number(row.finalDay),
        finalDayOfFinalWeek: Math.floor(Number(row.finalDay) / 7) + 6,
        startDay: Number(row.startDay),
        lastWeekRewardsClaimed: Number(row.lastWeekRewardsClaimed),
        rewardsClaimed: Number(formatEther(row.rewardsClaimed)),
        veOwnAmount: Number(formatEther(row.veOwnAmount)),
        claimableRewards: Number(
          // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
          formatEther(claimableRewards[idx] as bigint),
        ),
        positionId: Number(row.positionId),
        status: getStatus(
          currentDay,
          Number(row.finalDay),
          Number(row.lastWeekRewardsClaimed),
        ),
        currentDay,
        totalActiveVeOwnSupply: Number(
          formatEther(queryHooks.data.totalActiveVeOwnSupply),
        ),
        dailyRewardAmount: Number(
          formatEther(queryHooks.data.dailyRewardAmount),
        ),
        currentBoostMultiplier: Number(queryHooks.data.currentBoostMultiplier),
      }),
    ),
    refetch: queryHooks.refetch,
  };
};
