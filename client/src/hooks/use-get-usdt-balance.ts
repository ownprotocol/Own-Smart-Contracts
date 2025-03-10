import { PresaleAddress } from "@/constants/contracts";
import { useReadContract } from "thirdweb/react";
import { useContracts } from "@/hooks";

export const useGetBalanceUSDT = () => {
  const { usdtContract } = useContracts();

  const { data, isLoading } = useReadContract({
    contract: usdtContract,
    method: "function balanceOf(address account) returns (uint256)",
    params: [PresaleAddress],
  });
  const usdtPresaleBalance = data ? Number(data) : 0;
  return { usdtPresaleBalance, isLoading };
};
