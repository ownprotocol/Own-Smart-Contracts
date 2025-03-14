/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { useActiveAccount } from "thirdweb/react";
import { useRouter } from "next/navigation";

import StakingDrawerHeader from "./staking-drawer-header";
import Staking from "./staking";
import { useCheckAndSwitchToActiveChain, useUserOwnBalance } from "@/hooks";
import {
  NetworkSwitchDialog,
  StakingDrawerHeaderLoading,
  StakingLoading,
} from "@/components";
import { useGetAuthUser } from "@/query";
import { useState } from "react";

interface StakingDrawerContentProps {
  setIsOpen: (isOpen: boolean) => void;
}

const StakingDrawerContent = ({ setIsOpen }: StakingDrawerContentProps) => {
  const router = useRouter();
  const activeAccount = useActiveAccount();

  const [tokensToStake, setTokensToStake] = useState<number>(0);
  const [lockupDuration, setLockupDuration] = useState<number>(0);
  const { isValid } = useGetAuthUser();
  const { needsSwitch, switchToCorrectChain, currentAppChain } =
    useCheckAndSwitchToActiveChain(isValid);
  const {
    ownBalance,
    ownTokenSymbol,
    isLoading: isLoadingOwnBalance,
  } = useUserOwnBalance({
    userWalletAddress: activeAccount?.address ?? "",
  });
  const handleDialogClose = () => {
    router.push("/staking");
    setIsOpen(false);
  };

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
      {needsSwitch && (
        <NetworkSwitchDialog
          title={`Switch to stake $Own on ${currentAppChain?.name}`}
          isOpen={needsSwitch}
          onClose={handleDialogClose}
          onSwitch={switchToCorrectChain}
          networkName={currentAppChain?.name ?? ""}
        />
      )}
      <StakingDrawerHeader
        ownBalance={ownBalance ?? "0"}
        ownTokenSymbol={ownTokenSymbol}
      />
      <Staking
        ownBalance={ownBalance ?? "0"}
        ownTokenSymbol={ownTokenSymbol}
        needsSwitch={needsSwitch ?? false}
        tokensToStake={tokensToStake}
        lockupDuration={lockupDuration}
        setTokensToStake={setTokensToStake}
        setLockupDuration={setLockupDuration}
      />
      {/* staking loading */}
    </div>
  );
};

export default StakingDrawerContent;
