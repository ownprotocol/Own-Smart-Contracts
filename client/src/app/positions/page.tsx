"use client";

import {
  useActiveAccount,
  useActiveWalletConnectionStatus,
} from "thirdweb/react";

import {
  BlurredStakingBoard,
  ConnectWalletDialog,
  MainNavigation,
} from "@/components";
import { StakePageContent } from "@/components/user-stake/stake-page-content";
import { useStakingPositionsPage } from "@/hooks/use-staking-positions-page";
import HashLoader from "react-spinners/HashLoader";
import { useGetAuthUser } from "@/query";
function UserStakingPositionsPage() {
  const authUser = useGetAuthUser();
  const activeAccount = useActiveAccount();
  const queryHook = useStakingPositionsPage();

  if (authUser.isLoading || queryHook.isLoading) {
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
