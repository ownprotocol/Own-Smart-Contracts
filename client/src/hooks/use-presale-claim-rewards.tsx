import { useContracts } from "@/hooks";
import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { toast } from "react-toastify";
import { useState } from "react";

export const useClaimRewards = (refetchFn?: () => Promise<void>) => {
  const { presaleContract } = useContracts();
  const account = useActiveAccount();
  const [isLoading, setIsLoading] = useState(false);

  const claimRewards = async () => {
    if (!account) {
      console.error("Account not found");
      toast.error("No connected account found");
      return;
    }

    setIsLoading(true);
    try {
      await sendAndConfirmTransaction({
        account,
        transaction: prepareContractCall({
          contract: presaleContract,
          method: "claimPresaleRoundTokens",
          params: [0n, 100n],
        }),
      });

      if (refetchFn) {
        await refetchFn();
      }

      toast.success("Rewards claimed successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to claim rewards");
    } finally {
      setIsLoading(false);
    }
  };

  return { claimRewards, isLoading };
};

export default useClaimRewards;
