"use client";

import { StakePageContent } from "@/components/user-stake/stake-page-content";
import { useStakingPositionsPage } from "@/hooks/use-staking-positions-page";

function UserStakingPositionsPage() {
  const queryHook = useStakingPositionsPage();

  return (
    <div className="relative flex flex-col">
      <h1 className="header">Your Staking</h1>
      <StakePageContent queryHook={queryHook} />
    </div>
  );
}

export default UserStakingPositionsPage;
