/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { useActiveAccount } from "thirdweb/react";

import StakingDrawerHeader from "./staking-drawer-header";
import Staking from "./staking";
import { useUserOwnBalance } from "@/hooks";
import { StakingDrawerHeaderLoading, StakingLoading } from "@/components";

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
        <StakingDrawerHeaderLoading />
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

export default StakingDrawerContent;
