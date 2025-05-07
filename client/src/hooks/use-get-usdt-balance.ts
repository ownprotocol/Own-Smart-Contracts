import { toTokens } from "thirdweb/utils";
import { useContracts } from "@/hooks";
import { QueryHook } from "@/types/query";
import { useReadContractQueryHook } from "@/helpers/useReadContractWithParsing";

export const useGetBalanceUSDT = (address: string): QueryHook<number> => {
  const { usdtContract } = useContracts();

  return useReadContractQueryHook(
    {
      contract: usdtContract,
      method: "balanceOf",
      params: [address],
    },
    (value) => Number(toTokens(value, 18)),
  );
};
