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
        hasPresaleStarted: data[0],
        roundsInProgress: data[1],
        roundDetails: {
          duration: Number(data[2].duration),
          price: Number(formatEther(data[2].price)),
          allocation: Number(formatEther(data[2].allocation)),
          sales: Number(formatEther(data[2].sales)),
          claimTokensTimestamp: Number(data[2].claimTokensTimestamp),
          roundId: Number(data[3]),
        },
        endTime: Number(data[4]),
      }),
    );
  };
