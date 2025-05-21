"use client";

import { useActiveAccount } from "thirdweb/react";

import { ConnectWalletDialog } from "@/components";
import { StakePageContent } from "@/components/user-stake/stake-page-content";
import { useStakingPositionsPage } from "@/hooks/use-staking-positions-page";

function UserStakingPositionsPage() {
  const activeAccount = useActiveAccount();
  const queryHook = useStakingPositionsPage();

  if (!activeAccount) {
    return <ConnectWalletDialog redirectTo={`/positions`} />;
  }
  return (
    <div className="relative flex flex-col">
      <h1 className="font-funnel flex py-8 text-center text-[32px] font-[400] leading-[36px] tracking-[-5%] md:py-4 md:text-[72px] md:leading-[72px]">
        Your Staking
      </h1>
      <StakePageContent queryHook={queryHook} />
    </div>
  );
}

export default UserStakingPositionsPage;
