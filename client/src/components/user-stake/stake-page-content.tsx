"use client";

import { type useStakingPositionsPage } from "@/hooks/use-staking-positions-page";
import StakingRewards from "./staking-rewards";
import StakePositionsTable from "./positions/stake-positions-table";
import Loading from "@/app/loading";

interface StakePageContentProps {
  queryHook: ReturnType<typeof useStakingPositionsPage>;
}

export const StakePageContent = ({ queryHook }: StakePageContentProps) => {
  if (queryHook.isLoading) {
    return <Loading />;
  }

  const stakingPositions = queryHook.data;

  return (
    <>
      <StakingRewards
        stakePositions={stakingPositions}
        refetch={queryHook.refetch}
      />
      <StakePositionsTable stakePositions={stakingPositions} />
    </>
  );
};
