import { queryHookUnifier } from "@/helpers/query-hook-unifier";
import { useReadContractQueryHook } from "@/helpers/useReadContractWithParsing";
import { useContracts } from "./use-contracts";
import { formatEther } from "viem";

export const useStakingPage = () => {
  const { stakeContract } = useContracts();

  return queryHookUnifier({
    boost: useReadContractQueryHook(
      {
        contract: stakeContract,
        method: "getCurrentBoostMultiplier",
      },
      (value) => Number(formatEther(value)),
    ),
  });
};
