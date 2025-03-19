"use client";

import { useActiveWalletChain, useWalletBalance } from "thirdweb/react";
import { client } from "@/lib/client";
import { useContractAddresses } from "./use-contract-addresses";

export const useUserOwnBalance = ({
  userWalletAddress,
}: {
  userWalletAddress: string;
}) => {
  const { ownTokenAddress } = useContractAddresses();
  const activeChain = useActiveWalletChain();

  const { data, isLoading, isError } = useWalletBalance({
    chain: activeChain,
    address: userWalletAddress,
    client,
    tokenAddress: ownTokenAddress,
  });

  return {
    ownBalance: data?.displayValue,
    ownTokenSymbol: data?.symbol,
    isLoading,
    isError,
  };
};
