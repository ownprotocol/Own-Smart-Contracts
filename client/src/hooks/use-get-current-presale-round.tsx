import { useContracts } from "@/hooks";
import { formatUnits, formatEther } from "viem";
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
          price: Number(formatUnits(data[2].price, 6)),
          allocation: Number(formatEther(data[2].allocation)),
          sales: Number(formatUnits(data[2].sales, 6)),
          claimTokensTimestamp: Number(data[2].claimTokensTimestamp),
          roundId: Number(data[3]),
        },
        endTime: Number(data[4]),
      }),
    );
  };
