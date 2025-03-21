"use client";

import { usePresalePurchasesPage } from "@/hooks/use-presale-purchases-page";
import PresalePurchasesTable from "./presale-purchases-table";
import { Button } from "../ui/button";
import { useContracts } from "@/hooks";
import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { toast } from "react-toastify";

export const PresalePurchasesPageContent = () => {
  const presalePageHook = usePresalePurchasesPage();
  const { presaleContract } = useContracts();
  const account = useActiveAccount();

  if (presalePageHook.isLoading) {
    return <div>loading...</div>;
  }

  const claimRewards = async () => {
    if (!account) {
      console.error("Account not found");
      return;
    }

    try {
      await sendAndConfirmTransaction({
        account,
        transaction: prepareContractCall({
          contract: presaleContract,
          method: "claimPresaleRoundTokens",
          params: [],
        }),
      });

      await presalePageHook.refetch();

      toast.success("Rewards claimed successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to claim rewards");
    }
  };

  return (
    <>
      <PresalePurchasesTable rows={presalePageHook.data.presalePurchases} />
      <Button
        variant={"mainButton"}
        disabled={!presalePageHook.data.hasRewardsToClaim}
        onClick={claimRewards}
        useSpinner
      >
        Claim Rewards
      </Button>
    </>
  );
};
