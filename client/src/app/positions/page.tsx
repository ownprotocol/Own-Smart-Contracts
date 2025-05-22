"use client";

import { useActiveAccount } from "thirdweb/react";

import { ConnectWalletDialog } from "@/components";
import { StakePageContent } from "@/components/user-stake/stake-page-content";
import { useStakingPositionsPage } from "@/hooks/use-staking-positions-page";
import Loading from "../loading";

function UserStakingPositionsPage() {
  const activeAccount = useActiveAccount();
  const queryHook = useStakingPositionsPage();

  if (!activeAccount) {
    return (
      <>
        <Loading />
        <ConnectWalletDialog
          redirectTo={`/positions`}
          text="Connect wallet to see your staking positions"
        />
      </>
    );
  }

  return (
    <div className="relative flex flex-col">
      <h1 className="header">Your Staking</h1>
      <StakePageContent queryHook={queryHook} />
    </div>
  );
}

export default UserStakingPositionsPage;
