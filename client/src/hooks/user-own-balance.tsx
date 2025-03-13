"use client";

import { useWalletBalance } from "thirdweb/react";

import { getActiveChain } from "@/config/chain";
import { type Network } from "@/types";
import { getContractAddresses } from "@/config/contracts";
import { client } from "@/lib/client";

export const useUserOwnBalance = ({
  userWalletAddress,
}: {
  userWalletAddress: string;
}) => {
  const { ownTokenAddress } = getContractAddresses(
    process.env.NEXT_PUBLIC_NETWORK as Network,
  );
  const activeChain = getActiveChain();
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
