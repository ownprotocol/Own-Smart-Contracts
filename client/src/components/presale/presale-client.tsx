"use client";

import { PresalePurchasesPageContent } from "@/components/presale/presale-purchases-page-content";
import { usePresalePurchasesPage } from "@/hooks/use-presale-purchases-page";

function PresalePurchasesPage() {
  const presalePageHook = usePresalePurchasesPage();

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
