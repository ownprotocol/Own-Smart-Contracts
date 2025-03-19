import { getContractAddresses } from "@/config/contracts";
import { useGetCurrentPresaleRound } from "./use-get-current-presale-round";
import { useGetBalanceUSDT } from "./use-get-usdt-balance";
import { queryHookUnifier } from "@/helpers/query-hook-unifier";

export const usePresalePage = () => {
  const presaleData = queryHookUnifier({
    usdtBalance: useGetBalanceUSDT(getContractAddresses().presaleAddress),
    presaleRound: useGetCurrentPresaleRound(),
  });

  return presaleData;
};
