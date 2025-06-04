import { useGetCurrentPresaleRound } from "./use-get-current-presale-round";
import { useGetBalanceUSDT } from "./use-get-usdt-balance";
import { queryHookUnifier } from "@/helpers/query-hook-unifier";
import { useReadContractQueryHook } from "@/helpers/useReadContractWithParsing";
import { useContracts } from "./use-contracts";
import { useActiveAccount } from "thirdweb/react";
import { formatEther } from "viem";
import { useTestingSafeTimestamp } from "./use-testing-safe-timestamp";

export const useHomePresalePage = () => {
  const { ownTokenContract, presaleContract } = useContracts();
  const account = useActiveAccount();

  const presaleData = queryHookUnifier({
    usdtBalance: useGetBalanceUSDT(presaleContract.address),
    presaleRound: useGetCurrentPresaleRound(),
    usersOwnBalance: useReadContractQueryHook(
      {
        contract: ownTokenContract,
        method: "balanceOf",
        params: [account?.address ?? ""],
        queryOptions: {
          refetchInterval: 10000,
        },
      },
      (value) => Number(formatEther(value)),
    ),
    usersUSDTBalance: useGetBalanceUSDT(account?.address ?? ""),
    timestamp: useTestingSafeTimestamp(),
    startPresaleTime: useReadContractQueryHook(
      {
        contract: presaleContract,
        method: "startPresaleTime",
      },
      (value) => Number(value),
    ),
  });

  return presaleData;
};
