import { useReadContract } from "thirdweb/react";
import { useContracts } from "@/hooks";
import { formatEther } from "viem";
import { CurrentPresaleRoundDetails } from "@/types/presale";
import { QueryHook } from "@/types/query";

export const useGetCurrentPresaleRound =
  (): QueryHook<CurrentPresaleRoundDetails> => {
    const { presaleContract } = useContracts();

    const { data, isLoading } = useReadContract({
      contract: presaleContract,
      method: "getCurrentPresaleRoundDetails",
    });
    console.log(data);

    if (isLoading || !data) return { isLoading: true };

    return {
      data: {
        roundsInProgress: data[0],
        roundDetails: {
          duration: Number(data[1].duration),
          price: Number(formatEther(data[1].price)),
          allocation: Number(formatEther(data[1].allocation)),
          sales: Number(formatEther(data[1].sales)),
          claimTokensTimestamp: Number(data[1].claimTokensTimestamp),
        },
        roundId: Number(data[2]),
        endTime: Number(data[3]),
      },
      isLoading,
    };
  };
