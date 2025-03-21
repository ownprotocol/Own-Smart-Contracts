"use client";

import {
  MainNavigation,
  StakingRewards,
  StakeRewardsTable,
  NetworkSwitchDialog,
} from "@/components";
import { useCheckAndSwitchToActiveChain } from "@/hooks";

import { useRouter } from "next/navigation";
import { BlurredStakingBoard } from "@/components";
function UserStakingRewardsPage() {
  const router = useRouter();
  const { needsSwitch, switchToCorrectChain, currentAppChain } =
    useCheckAndSwitchToActiveChain();

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
    <main className="min-h-screen px-[5%] pt-[10%] md:px-[10%] md:pt-[3%]">
      <div className="relative flex flex-col">
        <h1 className="font-funnel flex py-8 text-center text-[32px] font-[400] leading-[36px] tracking-[-5%] md:py-4 md:text-[72px] md:leading-[72px]">
          Your Staking
        </h1>
        <StakingRewards />
        <StakeRewardsTable />
      </div>
      <MainNavigation />
    </main>
  );
}

export default UserStakingRewardsPage;
