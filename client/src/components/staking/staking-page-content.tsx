"use client";

import {
  StakeOwnTokenBanner,
  EarnAPYTimer,
  ConnectWalletButton,
} from "@/components";
import StakingDrawerContent from "@/components/staking/staking-drawer-content";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useStakingPage } from "@/hooks/use-staking-page";
import { useActiveAccount } from "thirdweb/react";
import { useState } from "react";

const buttonStyles =
  "font-funnel hover:bg-[#D58BFF] !mx-auto !w-full !max-w-fit !bg-[#C58BFF] !px-8 !py-6 !text-[14px] !font-medium !leading-[14px] !tracking-[0%] !text-black !md:text-[16px] !md:leading-[16px]";

export const StakingPageContent = () => {
  const { mainContentQuery, hasStakingStartedQuery } = useStakingPage();
  const account = useActiveAccount();

  const [stakingDrawerOpen, setStakingDrawerOpen] = useState(false);

  if (
    !hasStakingStartedQuery.isLoading &&
    hasStakingStartedQuery.data === false
  ) {
    return (
      <div className="mx-auto w-full px-[0%] pt-0 md:px-[5%] md:pt-8">
        Staking has not started yet
      </div>
    );
  }

  if (mainContentQuery.isLoading) {
    return (
      <div className="relative flex flex-col gap-8">
        <StakeOwnTokenSkeleton height={150} />
        <StakeOwnTokenSkeleton height={200} />
        <div className="mx-auto h-[52px] w-full animate-pulse rounded bg-gray-100/50 sm:w-[200px] md:h-[56px]" />
      </div>
    );
  }

  const { ownBalance, boost, timestamp } = mainContentQuery.data;

  return (
    <div className="relative flex flex-col">
      <StakeOwnTokenBanner percentage={boost} />
      <EarnAPYTimer percentage={boost} timestamp={timestamp} />
      <div className="mt-2 flex flex-col gap-3 p-4 sm:flex-row sm:justify-center sm:gap-4">
        <Drawer open={stakingDrawerOpen} onOpenChange={setStakingDrawerOpen}>
          <DrawerTrigger asChild>
            {account && <Button className={buttonStyles}>Stake $Own</Button>}
          </DrawerTrigger>
          <DrawerContent className="h-[90vh] max-h-[90vh] px-[5%] md:px-[10%] xl:h-[90vh] xl:max-h-[90vh]">
            <StakingDrawerContent
              ownBalance={ownBalance}
              setIsOpen={setStakingDrawerOpen}
            />
          </DrawerContent>
        </Drawer>
        {!account && (
          <ConnectWalletButton
            title="Stake $Own"
            bgColor="#C58BFF"
            textColor="black"
            isHoverable={false}
            className={
              "!md:text-[20px] !md:leading-[20px] !font-funnel !cursor-pointer !font-semibold"
            }
          />
        )}
      </div>
    </div>
  );
};

type StakeOwnTokenSkeletonProps = {
  height: number;
};

function StakeOwnTokenSkeleton({ height }: StakeOwnTokenSkeletonProps) {
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
