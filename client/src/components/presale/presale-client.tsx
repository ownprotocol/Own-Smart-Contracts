"use client";

import { useActiveAccount } from "thirdweb/react";

import { ConnectWalletDialog } from "@/components";
import { PresalePurchasesPageContent } from "@/components/presale/presale-purchases-page-content";
import { usePresalePurchasesPage } from "@/hooks/use-presale-purchases-page";

function PresalePurchasesPage() {
  const activeAccount = useActiveAccount();

  const presalePageHook = usePresalePurchasesPage();

  if (!activeAccount) {
    return <ConnectWalletDialog redirectTo="/presale" />;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto flex w-full flex-col items-center justify-center">
        <h1 className="font-funnel flex text-center text-[32px] font-[400] leading-[36px] tracking-[-5%] md:py-4 md:text-[72px] md:leading-[72px]">
          $Own Token Presale Purchases
        </h1>
      </div>
      <PresalePurchasesPageContent presalePageHook={presalePageHook} />
    </div>
  );
}

export default PresalePurchasesPage;
