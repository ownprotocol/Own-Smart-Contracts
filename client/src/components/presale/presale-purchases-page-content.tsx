"use client";

import { type usePresalePurchasesPage } from "@/hooks/use-presale-purchases-page";
import PresalePurchasesTable from "./presale-purchases-table";
import { Button } from "../ui/button";
import { useContracts } from "@/hooks";
import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

interface PresalePurchasesPageContentProps {
  presalePageHook: ReturnType<typeof usePresalePurchasesPage>;
}

export const PresalePurchasesPageContent = ({
  presalePageHook,
}: PresalePurchasesPageContentProps) => {
  const { presaleContract } = useContracts();
  const account = useActiveAccount();

  if (presalePageHook.isLoading) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <HashLoader
          color={"#FFA500"}
          loading={true}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
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
          // Pass the entire list of presale purchases
          params: [0n, BigInt(presalePageHook.data.presalePurchases.length)],
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
