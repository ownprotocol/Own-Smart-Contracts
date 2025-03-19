"use client";

import { useActiveWalletChain, useWalletBalance } from "thirdweb/react";

import { getContractAddresses } from "@/config/contracts";
import { client } from "@/lib/client";

export const useUserOwnBalance = ({
  userWalletAddress,
}: {
  userWalletAddress: string;
}) => {
  const { ownTokenAddress } = getContractAddresses();
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
