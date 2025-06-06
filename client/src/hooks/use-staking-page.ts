import { queryHookUnifier } from "@/helpers/query-hook-unifier";
import { useReadContractQueryHook } from "@/helpers/useReadContractWithParsing";
import { useContracts } from "./use-contracts";
import { formatEther } from "viem";
import { useActiveAccount } from "thirdweb/react";
import { useTestingSafeTimestamp } from "./use-testing-safe-timestamp";

export const useStakingPage = () => {
  const { stakeContract, ownTokenContract } = useContracts();
  const account = useActiveAccount();

  const mainContentQuery = queryHookUnifier({
    boost: useReadContractQueryHook(
      {
        contract: stakeContract,
        method: "getCurrentBoostMultiplier",
      },
      (value) => Number(formatEther(value)),
    ),
    ownBalance: useReadContractQueryHook(
      {
        contract: ownTokenContract,
        method: "balanceOf",
        params: [account?.address ?? ""],
      },
      (value) => Number(formatEther(value)),
    ),
    timestamp: useTestingSafeTimestamp(),
    hasStakingStarted: useReadContractQueryHook({
      contract: stakeContract,
      method: "hasStakingStarted",
    }),
    stakingStartWeek: useReadContractQueryHook(
      {
        contract: stakeContract,
        method: "stakingStartWeek",
      },
      (value) => Number(value),
    ),
  });

  return mainContentQuery;
};
