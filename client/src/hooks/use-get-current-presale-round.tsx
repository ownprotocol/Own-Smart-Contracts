import { useContracts } from "@/hooks";
import { formatEther } from "viem";
import { CurrentPresaleRoundDetails } from "@/types/presale";
import { QueryHook } from "@/types/query";
import { useReadContractQueryHook } from "@/helpers/useReadContractWithParsing";

export const useGetCurrentPresaleRound =
  (): QueryHook<CurrentPresaleRoundDetails> => {
    const { presaleContract } = useContracts();

    return useReadContractQueryHook(
      {
        contract: presaleContract,
        method: "getCurrentPresaleRoundDetails",
      },
      (data) => ({
        roundsInProgress: data[0],
        roundDetails: {
          duration: Number(data[1].duration),
          price: Number(formatEther(data[1].price)),
          allocation: Number(formatEther(data[1].allocation)),
          sales: Number(formatEther(data[1].sales)),
          claimTokensTimestamp: Number(data[1].claimTokensTimestamp),
          roundId: Number(data[2]),
        },
        endTime: Number(data[3]),
      }),
    );
  };
