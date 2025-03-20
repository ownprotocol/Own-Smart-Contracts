"use client";

import { usePresalePurchasesPage } from "@/hooks/use-presale-purchases-page";
import PresalePurchasesTable from "./presale-purchases-table";
import { Button } from "../ui/button";
import { useContracts } from "@/hooks";
import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { toast } from "react-toastify";

export const PresalePurchasesPageContent = () => {
  const presalePageHook = usePresalePurchasesPage();
  const { presaleContract } = useContracts();
  const { mutateAsync: sendTxAsync } = useSendTransaction();

  if (presalePageHook.isLoading) {
    return <div>loading...</div>;
  }

  const claimRewards = async () => {
    try {
      await sendTxAsync(
        prepareContractCall({
          contract: presaleContract,
          method: "claimPresaleRoundTokens",
          params: [],
        }) as any, // Stupid type error, absolutely thirdwebs fault here
      );

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
      >
        Claim Rewards
      </Button>
    </>
  );
};
