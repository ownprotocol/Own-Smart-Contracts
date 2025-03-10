import { useReadContract } from "thirdweb/react";
import { toTokens } from "thirdweb/utils";
import { useContracts } from "@/hooks";

export const useGetBalanceUSDT = (address: string) => {
  const { usdtContract } = useContracts();

  const { data, isLoading } = useReadContract({
    contract: usdtContract,
    method: "function balanceOf(address account) returns (uint256)",
    params: [address],
  });
  const usdtBalance = data ? toTokens(data, 18) : 0;
  return { usdtBalance, isLoading };
};
