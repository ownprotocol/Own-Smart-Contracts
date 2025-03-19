import { useGetCurrentPresaleRound } from "./use-get-current-presale-round";
import { useGetBalanceUSDT } from "./use-get-usdt-balance";
import { queryHookUnifier } from "@/helpers/query-hook-unifier";
import { useContractAddresses } from "./use-contract-addresses";

export const usePresalePage = () => {
  const { presaleAddress } = useContractAddresses();

  const presaleData = queryHookUnifier({
    usdtBalance: useGetBalanceUSDT(presaleAddress),
    presaleRound: useGetCurrentPresaleRound(),
  });

  return presaleData;
};
