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
      <h1 className="header">Your Staking</h1>
      <StakePageContent queryHook={queryHook} />
    </div>
  );
}

export default UserStakingPositionsPage;
