import { PresaleAddress, USDTAddress } from "@/constants/contracts";
import { client } from "@/lib/client";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useActiveAccount, useReadContract } from "thirdweb/react";

const useContracts = () => {
  const usdtContract = getContract({
    client,
    address: USDTAddress,
    chain: sepolia,
  });

  const presaleContract = getContract({
    client,
    address: PresaleAddress,
    chain: sepolia,
  });

  return { usdtContract, presaleContract };
};

export const useGetBalanceUSDT = () => {
  const { usdtContract } = useContracts();

  const account = useActiveAccount();

  const { data, isLoading } = useReadContract({
    contract: usdtContract,
    method: "function balanceOf(address user) returns (uint256)",
    params: [PresaleAddress],
  });

  return data;
};

export const useGetPresaleRound = () => {
  const { presaleContract } = useContracts();

  const { data, isLoading } = useReadContract({
    contract: presaleContract,
    method:
      "function getCurrentPresaleRoundDetails() returns (bool, [uint256, uint256, uint256, uint256], uint256)",
  });
};
