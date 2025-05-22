"use client";

import { useActiveAccount } from "thirdweb/react";

import { ConnectWalletDialog } from "@/components";
import { PresalePurchasesPageContent } from "@/components/presale/presale-purchases-page-content";
import { usePresalePurchasesPage } from "@/hooks/use-presale-purchases-page";
import Loading from "@/app/loading";

function PresalePurchasesPage() {
  const activeAccount = useActiveAccount();

  const presalePageHook = usePresalePurchasesPage();

  if (!activeAccount) {
    return (
      <>
        <Loading />
        <ConnectWalletDialog redirectTo="/presale" />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto flex w-full flex-col items-center justify-center">
        <h1 className="header">$Own Token Presale Purchases</h1>
      </div>
      <PresalePurchasesPageContent presalePageHook={presalePageHook} />
    </div>
  );
}

export default PresalePurchasesPage;
