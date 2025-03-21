"use client";

import { useStakingPositionsPage } from "@/hooks/use-staking-positions-page";
import StakingRewards from "./staking-rewards";
import StakePositionsTable from "./positions/stake-positions-table";

export const StakePageContent = () => {
  const queryHook = useStakingPositionsPage();

  if (queryHook.isLoading) {
    return <div>loading...</div>;
  }

  return (
    <>
      <StakingRewards />
      <StakePositionsTable />
    </>
  );
};
