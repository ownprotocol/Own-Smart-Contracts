"use client";
import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";
import { useRouter } from "next/navigation";
import HashLoader from "react-spinners/HashLoader";

import {
  BlurredStakingBoard,
  ConnectWalletDialog,
  MainNavigation,
  NetworkSwitchDialog,
} from "@/components";
import { PresalePurchasesPageContent } from "@/components/presale/presale-purchases-page-content";
import { useChainSwitch } from "@/providers/network-switch-provider";
import { useGetAuthUser } from "@/query";
import { usePresalePurchasesPage } from "@/hooks/use-presale-purchases-page";

function PresalePurchasesPage() {
  const authUser = useGetAuthUser();
  const activeAccount = useActiveAccount();
  const status = useActiveWalletConnectionStatus();
  const router = useRouter();

  const presalePageHook = usePresalePurchasesPage();

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

  if (authUser.isLoading || presalePageHook.isLoading) {
    return (
      <main className="min-h-screen px-[5%] pt-[10%] md:px-[10%] md:pt-[3%]">
        <div className="flex h-[500px] w-full items-center justify-center">
          <HashLoader
            color={"#FFA500"}
            loading={true}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      </main>
    );
  }

  if (!activeAccount && status !== "connected") {
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
      <PresalePurchasesPageContent presalePageHook={presalePageHook} />
      <MainNavigation />
    </main>
  );
}

export default PresalePurchasesPage;
