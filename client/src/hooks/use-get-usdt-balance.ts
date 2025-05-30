import { useContracts } from "@/hooks";
import { QueryHook } from "@/types/query";
import { useReadContractQueryHook } from "@/helpers/useReadContractWithParsing";
import { formatUnits } from "viem";

export const useGetBalanceUSDT = (address: string): QueryHook<number> => {
  const { usdtContract } = useContracts();

  return useReadContractQueryHook(
    {
      contract: usdtContract,
      method: "balanceOf",
      params: [address],
    },
    (value) => Number(formatUnits(value, 6)),
  );
};
