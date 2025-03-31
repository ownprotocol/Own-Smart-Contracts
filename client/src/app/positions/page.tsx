"use client";

import {
  useActiveAccount,
} from "thirdweb/react";

import {
  BlurredStakingBoard,
  ConnectWalletDialog,
  MainNavigation,
} from "@/components";
import { StakePageContent } from "@/components/user-stake/stake-page-content";
import { useStakingPositionsPage } from "@/hooks/use-staking-positions-page";
import { useGetAuthUser } from "@/query";
import Loading from "../loading";

function UserStakingPositionsPage() {
  const authUser = useGetAuthUser();
  const activeAccount = useActiveAccount();
  const queryHook = useStakingPositionsPage();

  if (authUser.isLoading || queryHook.isLoading) {
    return <Loading />;
  }

  if (!activeAccount) {
    return (
      <main className="min-h-screen px-[5%] pt-[10%] md:px-[10%] md:pt-[3%]">
        <ConnectWalletDialog redirectTo={`/positions`} />
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
        <StakePageContent queryHook={queryHook} />
      </div>
      <MainNavigation />
    </main>
  );
}

export default UserStakingPositionsPage;
