import { useReadContract } from "thirdweb/react";
import { useContracts } from "@/hooks";

export const useGetCurrentPresaleRound = () => {
  const { presaleContract } = useContracts();

  const { data, isLoading } = useReadContract({
    contract: presaleContract,
    method: "getCurrentPresaleRoundDetails",
  });
  const presaleData = data
    ? {
        success: data[0],
        round: {
          duration: Number(data[1].duration),
          price: Number(data[1].price),
          allocation: Number(data[1].allocation),
          sales: Number(data[1].sales),
        },
        roundId: Number(data[2]),
      }
    : null;
  return { presaleData, isLoading };
};
