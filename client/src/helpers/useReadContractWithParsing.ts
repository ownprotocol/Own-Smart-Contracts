import { useReadContract } from "thirdweb/react";
import { Abi, AbiFunction } from "viem";
import { QueryHook } from "@/types/query";
import { AbiOfLength } from "node_modules/thirdweb/dist/types/contract/types";
import { ExtractAbiFunctionNames } from "abitype";
import { WithPickedOnceQueryOptions } from "node_modules/thirdweb/dist/types/react/core/hooks/types";
import { ReadContractOptions } from "thirdweb";
import { ParseMethod } from "node_modules/thirdweb/dist/types/transaction/types";
import { PreparedMethod } from "node_modules/thirdweb/dist/types/utils/abi/prepare-method";
import { ReadContractResult } from "node_modules/thirdweb/dist/types/transaction/read-contract";

// This method really just converts the useReadContract response type into a QueryHook response type
// For usage with the QueryHookUnifier
// Additionally we can parse the value before returning it to remove the need to write a custom hook for everything
// We've had to create a number of overloads to make this work properly

export function useReadContractQueryHook<
  const TAbi extends Abi,
  const TMethod extends TAbi extends AbiOfLength<0>
    ? AbiFunction | string
    : ExtractAbiFunctionNames<TAbi>,
>(
  options: WithPickedOnceQueryOptions<ReadContractOptions<TAbi, TMethod>>,
): QueryHook<ReadContractResult<PreparedMethod<ParseMethod<TAbi, TMethod>>[2]>>;

export function useReadContractQueryHook<
  const TAbi extends Abi,
  const TMethod extends TAbi extends AbiOfLength<0>
    ? AbiFunction | string
    : ExtractAbiFunctionNames<TAbi>,
  V,
>(
  options: WithPickedOnceQueryOptions<ReadContractOptions<TAbi, TMethod>>,
  parser: (
    data: ReadContractResult<PreparedMethod<ParseMethod<TAbi, TMethod>>[2]>,
  ) => V,
): QueryHook<V>;

// The implementation signature must also carry generics properly:
export function useReadContractQueryHook<
  const TAbi extends Abi,
  const TMethod extends TAbi extends AbiOfLength<0>
    ? AbiFunction | string
    : ExtractAbiFunctionNames<TAbi>,
  V = undefined,
>(
  options: WithPickedOnceQueryOptions<ReadContractOptions<TAbi, TMethod>>,
  parser?: (
    data: ReadContractResult<PreparedMethod<ParseMethod<TAbi, TMethod>>[2]>,
  ) => V,
): QueryHook<
  V extends undefined
    ? ReadContractResult<PreparedMethod<ParseMethod<TAbi, TMethod>>[2]>
    : V
> {
  const { isLoading, data, error, refetch } = useReadContract(options);
  if (error) console.error(error);

  if (isLoading || data === undefined) return { isLoading: true };

  return {
    data: (parser ? parser(data) : data) as any,
    isLoading,
    refetch: async () => {
      refetch();
    },
  };
}
