"use client";
import { useActiveAccount } from "thirdweb/react";

import {
  BlurredStakingBoard,
  ConnectWalletDialog,
  MainNavigation,
  NetworkSwitchDialog,
} from "@/components";
import { PresalePurchasesPageContent } from "@/components/presale/presale-purchases-page-content";
import { useRouter } from "next/navigation";
import { useChainSwitch } from "@/providers/network-switch-provider";

function PresalePurchasesPage() {
  const activeAccount = useActiveAccount();
  const router = useRouter();
  const { needsSwitch, switchToCorrectChain, currentAppChain } =
    useChainSwitch();

  const handleDialogClose = () => {
    router.push("/");
  };
  if (needsSwitch) {
    return (
      <main className="min-h-screen px-[5%] pt-[10%] md:px-[10%] md:pt-[3%]">
        <NetworkSwitchDialog
          title={`Switch to view your rewards on ${currentAppChain?.name}`}
          isOpen={needsSwitch}
          onClose={handleDialogClose}
          onSwitch={switchToCorrectChain}
          networkName={currentAppChain?.name ?? ""}
        />
        <BlurredStakingBoard />
      </main>
    );
  }
  if (!activeAccount?.address) {
    return (
      <main className="min-h-screen px-[5%] pt-[10%] md:px-[10%] md:pt-[3%]">
        <ConnectWalletDialog redirectTo="/presale" />
        <BlurredStakingBoard />
      </main>
    );
  }
  return (
    <main className="min-h-screen px-[5%] pt-4 md:px-[10%] md:pt-8">
      <div className="mx-auto flex w-full flex-col items-center justify-center">
        <h1 className="font-funnel flex text-center text-[32px] font-[400] leading-[36px] tracking-[-5%] md:py-4 md:text-[72px] md:leading-[72px]">
          $Own Token Presale Purchases
        </h1>
      </div>
      <PresalePurchasesPageContent />
      <MainNavigation />
    </main>
  );
}

export default PresalePurchasesPage;
