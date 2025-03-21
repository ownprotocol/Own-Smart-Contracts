import { queryHookUnifier } from "@/helpers/query-hook-unifier";
import { useReadContractQueryHook } from "@/helpers/useReadContractWithParsing";
import { useActiveAccount } from "thirdweb/react";
import { useContracts } from "./use-contracts";
import { PresalePurchase, PresaleRoundDetails } from "@/types/presale";
import { formatEther } from "viem";
import keyBy from "lodash/keyBy";
import { QueryHook } from "@/types/query";
import { orderBy } from "lodash";
import { useGetCurrentPresaleRound } from "./use-get-current-presale-round";
import { useTestingSafeTimestamp } from "./use-testing-safe-timestamp";

export const usePresalePurchasesPage = (): QueryHook<{
  presalePurchases: PresalePurchase[];
  hasRewardsToClaim: boolean;
}> => {
  const account = useActiveAccount();
  const { presaleContract } = useContracts();

  const queryHooks = queryHookUnifier({
    usersPurchases: useReadContractQueryHook({
      contract: presaleContract,
      method: "getUsersPresalePurchases",
      params: [account?.address ?? ""],
    }),
    presaleRounds: useReadContractQueryHook(
      {
        contract: presaleContract,
        method: "getAllPresaleRounds",
      },
      (data): PresaleRoundDetails[] =>
        data.map((round, idx) => ({
          roundId: idx,
          allocation: Number(formatEther(round.allocation)),
          duration: Number(round.duration),
          price: Number(formatEther(round.price)),
          sales: Number(formatEther(round.sales)),
          claimTokensTimestamp: Number(round.claimTokensTimestamp),
        })),
    ),
    currentRoundId: useGetCurrentPresaleRound(),
    date: useTestingSafeTimestamp(),
  });

  if (queryHooks.isLoading) {
    return {
      isLoading: true,
    };
  }

  const presaleRoundsByRoundId = keyBy(
    queryHooks.data.presaleRounds,
    "roundId",
  );

  let hasRewardsToClaim = false;
  const formattedPresalePurchases = orderBy(
    queryHooks.data.usersPurchases.map((value): PresalePurchase => {
      const roundDetails = presaleRoundsByRoundId[Number(value.roundId)];

      // Error should never happen
      if (!roundDetails) {
        throw new Error(
          `Round details not found for roundId: ${value.roundId}`,
        );
      }

      let claimStatus: PresalePurchase["claimStatus"] = "not-ready-to-claim";
      if (!value.claimed) {
        if (
          !queryHooks.data.currentRoundId.roundsInProgress ||
          queryHooks.data.currentRoundId.roundDetails.roundId > value.roundId
        ) {
          if (roundDetails.claimTokensTimestamp < queryHooks.data.date) {
            claimStatus = "able-to-claim";
            hasRewardsToClaim = true;
          }
        }
      } else {
        claimStatus = "claimed";
      }

      return {
        roundId: Number(value.roundId),
        ownAmount: Number(formatEther(value.ownAmount)),
        usdtAmount: Number(formatEther(value.usdtAmount)),
        receiver: value.receiver,
        timestamp: new Date(Number(value.timestamp) * 1000),
        claimStatus: claimStatus,
        price: roundDetails.price,
      };
    }),
    "timestamp",
    ["desc"],
  );

  return {
    isLoading: false,
    refetch: queryHooks.refetch,
    data: {
      presalePurchases: formattedPresalePurchases,
      hasRewardsToClaim,
    },
  };
};
