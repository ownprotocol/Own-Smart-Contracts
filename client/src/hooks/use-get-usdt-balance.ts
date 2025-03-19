import { useReadContract } from "thirdweb/react";
import { toTokens } from "thirdweb/utils";
import { useContracts } from "@/hooks";
import { QueryHook } from "@/types/query";

export const useGetBalanceUSDT = (address: string): QueryHook<number> => {
  const { usdtContract } = useContracts();

  const { data, isLoading } = useReadContract({
    contract: usdtContract,
    method: "function balanceOf(address account) returns (uint256)",
    params: [address],
  });
  if (isLoading || data === undefined) return { isLoading: true };
  console.log(data);

  const usdtBalance = Number(toTokens(data, 18));

  return { data: usdtBalance, isLoading };
};
