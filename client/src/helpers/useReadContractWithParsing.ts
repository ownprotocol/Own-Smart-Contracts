import { useReadContract } from "thirdweb/react";
import { type Abi, type AbiFunction } from "viem";
import { type QueryHook } from "@/types/query";
import { type AbiOfLength } from "node_modules/thirdweb/dist/types/contract/types";
import { type ExtractAbiFunctionNames } from "abitype";
import { type WithPickedOnceQueryOptions } from "node_modules/thirdweb/dist/types/react/core/hooks/types";
import { type ReadContractOptions } from "thirdweb";
import { type ParseMethod } from "node_modules/thirdweb/dist/types/transaction/types";
import { type PreparedMethod } from "node_modules/thirdweb/dist/types/utils/abi/prepare-method";
import { type ReadContractResult } from "node_modules/thirdweb/dist/types/transaction/read-contract";

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
  if (error) {
    console.error("Error in useReadContractQueryHook: ", options.method);
    console.error(error);
  }

  if (isLoading || data === undefined) return { isLoading: true };

  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    data: (parser ? parser(data) : data) as any,
    isLoading,
    refetch: async () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      refetch();
    },
  };
}
