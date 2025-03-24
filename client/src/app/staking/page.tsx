"use client";

import { useRouter } from "next/navigation";

import {
  MainNavigation,
  NetworkSwitchDialog,
  BlurredStakingBoard,
} from "@/components";
import { StakingPageContent } from "@/components/staking/staking-page-content";
import { useChainSwitch } from "@/providers/network-switch-provider";
import { useGetAuthUser } from "@/query";

function StakingPage() {
  const router = useRouter();
  
  const authUser = useGetAuthUser();
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
  return (
    <main className="min-h-screen px-[5%] pt-4 md:px-[10%] md:pt-8">
      <div className="mx-auto flex w-full flex-col items-center justify-center md:w-[75%]">
        {!authUser.isLoading ? <h1 className="font-funnel flex px-8 py-8 text-center text-[32px] font-[400] leading-[36px] tracking-[-5%] md:py-4 md:text-[72px] md:leading-[72px]">
          Stake $Own Token
        </h1> : null}
      </div>
      <StakingPageContent
        authUserLoading={authUser.isLoading}
      />
      <MainNavigation />
    </main>
  );
}

export default StakingPage;
