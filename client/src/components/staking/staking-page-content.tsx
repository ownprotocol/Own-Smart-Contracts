"use client";

import { StakeOwnTokenBanner, EarnAPYTimer } from "@/components";
import StakingDrawerContent from "@/components/staking/staking-drawer-content";
import { Button } from "@/components/ui/button";
import { useStakingPage } from "@/hooks/use-staking-page";
import { useActiveAccount } from "thirdweb/react";
import { useState } from "react";
import Loading from "@/app/loading";
import { convertStakeWeekToUnixTime } from "@/lib/staking";
import { TimerCountdown } from "../timer-countdown";
import { CustomDrawer } from "../drawer";
import { Dots } from "../home/dots";

export const StakingPageContent = () => {
  const mainContentQuery = useStakingPage();
  const account = useActiveAccount();
  const [stakingDrawerOpen, setStakingDrawerOpen] = useState(false);

  if (mainContentQuery.isLoading) {
    return <Loading />;
  }

  const { ownBalance, boost, timestamp, hasStakingStarted } =
    mainContentQuery.data;

  if (!hasStakingStarted) {
    const unixStakingStartTime = convertStakeWeekToUnixTime(
      mainContentQuery.data.stakingStartWeek,
    );

    return (
      <div className="flex flex-col items-center">
        <h1 className="header">Staking will start in</h1>
        <TimerCountdown duration={unixStakingStartTime - timestamp} />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      <Dots />
      <h1 className="header !pt-8">Stake $Own Token</h1>
      <StakeOwnTokenBanner percentage={boost} />
      <EarnAPYTimer percentage={boost} timestamp={timestamp} />
      <CustomDrawer
        isOpen={stakingDrawerOpen}
        onOpenChange={setStakingDrawerOpen}
        button={
          <Button variant="mainButton" size="lg" disabled={!account}>
            Stake $Own
          </Button>
        }
      >
        <StakingDrawerContent
          ownBalance={ownBalance}
          setIsOpen={setStakingDrawerOpen}
        />
      </CustomDrawer>
    </div>
  );
};

type StakeOwnTokenSkeletonProps = {
  height: number;
};

export function StakeOwnTokenSkeleton({ height }: StakeOwnTokenSkeletonProps) {
  return (
    <div className="container mx-auto">
      <div className="mx-auto flex w-full flex-col items-center justify-center md:w-[75%]">
        <div
          className={`h-[${height}px] w-full animate-pulse rounded bg-gray-100/50 px-8 md:h-[${height}px] md:px-0`}
        />
      </div>
    </div>
  );
}
