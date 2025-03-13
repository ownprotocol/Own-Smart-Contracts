"use client";
import { useActiveAccount } from "thirdweb/react";

import StakingDrawerHeader from "./staking-drawer-header";
import Staking from "./staking";
import { DrawerHeader, DrawerTitle } from "../ui/drawer";
import { useUserOwnBalance } from "@/hooks";

const StakingDrawerContent = () => {
  const activeAccount = useActiveAccount();
  const {
    ownBalance,
    ownTokenSymbol,
    isLoading: isLoadingOwnBalance,
  } = useUserOwnBalance({
    userWalletAddress: activeAccount?.address ?? "",
  });

  if (isLoadingOwnBalance) {
    return (
      <div className="mx-auto w-full px-[0%] pt-0 md:px-[5%] md:pt-8">
        <StakingDrawerLoading />
        <StakingLoading />
      </div>
    );
  }
  return (
    <div className="mx-auto w-full px-[0%] pt-0 md:px-[5%] md:pt-8">
      <StakingDrawerHeader
        ownBalance={ownBalance ?? "0"}
        ownTokenSymbol={ownTokenSymbol}
      />
      <Staking ownBalance={ownBalance ?? "0"} ownTokenSymbol={ownTokenSymbol} />
    </div>
  );
};
function StakingDrawerLoading() {
  return (
    <DrawerHeader className="relative">
      <DrawerTitle className="text-black">
        <div className="flex w-full flex-col justify-center gap-1 md:flex-row md:gap-4">
          {/* Skeleton for "Stake tokens" text */}
          <div className="h-[28px] w-full animate-pulse rounded bg-gray-100/50 lg:h-[38px] xl:h-[48px]" />
        </div>
      </DrawerTitle>
    </DrawerHeader>
  );
}

function StakingLoading() {
  return (
    <div className="px-4 py-2">
      <div className="flex flex-col gap-0 md:gap-4">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Staking Tokens Section Skeleton */}
          <div className="flex w-full flex-col gap-2 px-4 py-4 md:py-12">
            <div className="h-6 w-48 animate-pulse rounded bg-gray-100/50" />
            <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100/50" />
            <div className="h-4 w-32 animate-pulse rounded bg-gray-100/50" />
          </div>

          {/* Lock Up Period Section Skeleton */}
          <div className="flex w-full flex-col gap-2">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-100/50" />
            <div className="h-12 w-full animate-pulse rounded-lg bg-gray-100/50" />
            <div className="h-4 w-32 animate-pulse rounded bg-gray-100/50" />
          </div>
        </div>

        {/* Max Reward Text Skeleton */}
        <div className="w-full text-end">
          <div className="ml-auto h-5 w-32 animate-pulse rounded bg-gray-100/50 md:h-6" />
        </div>

        {/* Summary and Reward Cards Section */}
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          {/* Summary Section Skeleton */}
          <div className="flex w-full flex-col gap-2">
            <div className="w-full rounded-lg px-0 md:px-4">
              <div className="h-40 w-full animate-pulse rounded-lg bg-gray-100/50" />
            </div>
          </div>

          {/* Reward Card Section Skeleton */}
          <div className="w-full">
            <div className="h-40 w-full animate-pulse rounded-lg bg-gray-100/50" />
          </div>
        </div>

        {/* Footer Button Skeleton */}
        <div className="mt-4 flex justify-start">
          <div className="h-10 w-32 animate-pulse rounded-lg bg-gray-100/50 md:h-12 md:w-40" />
        </div>
      </div>
    </div>
  );
}

export default StakingDrawerContent;
