"use client";
import { useQuery } from "@tanstack/react-query";
import axios, { type AxiosResponse } from "axios";

export const GetAllowanceQueryKey = "get-allowance";

interface AllowanceResponse {
  allowance: string;
}

const getAllowance = async (
  owner: string,
  spender: string,
  tokenAddress: string,
): Promise<AxiosResponse<AllowanceResponse>> => {
  return axios.get(
    `/api/contracts/allowance?owner=${owner}&spender=${spender}&tokenAddress=${tokenAddress}`,
  );
};

export const useGetAllowance = (
  owner: string,
  spender: string,
  tokenAddress: string,
  enabled = true,
) => {
  const { data, ...queryResponse } = useQuery({
    queryKey: [GetAllowanceQueryKey, owner, spender, tokenAddress],
    queryFn: () => getAllowance(owner, spender, tokenAddress),
    enabled: !!owner && !!spender && enabled,
  });

  return {
    allowance: data?.data.allowance,
    ...queryResponse,
  };
};
