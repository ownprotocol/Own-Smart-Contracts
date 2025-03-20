import { useGetCurrentPresaleRound } from "./use-get-current-presale-round";
import { useGetBalanceUSDT } from "./use-get-usdt-balance";
import { queryHookUnifier } from "@/helpers/query-hook-unifier";
import { useContractAddresses } from "./use-contract-addresses";
import { useReadContractQueryHook } from "@/helpers/useReadContractWithParsing";
import { useContracts } from "./use-contracts";
import { useActiveAccount } from "thirdweb/react";
import { formatEther } from "viem";
import { useTestingSafeTimestamp } from "./use-testing-safe-timestamp";

export const useHomePresalePage = () => {
  const { presaleAddress } = useContractAddresses();
  const { ownTokenContract } = useContracts();
  const account = useActiveAccount();

  const presaleData = queryHookUnifier({
    usdtBalance: useGetBalanceUSDT(presaleAddress),
    presaleRound: useGetCurrentPresaleRound(),
    usersOwnBalance: useReadContractQueryHook(
      {
        contract: ownTokenContract,
        method: "balanceOf",
        params: [account?.address || ""],
      },
      (value) => Number(formatEther(value)),
    ),
    usersUSDTBalance: useGetBalanceUSDT(account?.address || ""),
    timestamp: useTestingSafeTimestamp(),
  });

  return presaleData;
};
