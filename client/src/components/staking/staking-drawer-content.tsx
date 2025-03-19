"use client";
import { useActiveAccount } from "thirdweb/react";
import { useRouter } from "next/navigation";

import StakingDrawerHeader from "./staking-drawer-header";
import Staking from "./staking";
import { useCheckAndSwitchToActiveChain, useUserOwnBalance } from "@/hooks";
import {
  NetworkSwitchDialog,
  StakingConfirmation,
  StakingDrawerHeaderLoading,
  StakingLoading,
  StakingLoadingState,
} from "@/components";
import { useState } from "react";

interface StakingDrawerContentProps {
  setIsOpen: (isOpen: boolean) => void;
}

const StakingDrawerContent = ({ setIsOpen }: StakingDrawerContentProps) => {
  const router = useRouter();
  const activeAccount = useActiveAccount();

  const [isStakingLoading, setIsStakingLoading] = useState(false);
  const [confirmStaking, setConfirmStaking] = useState(false);
  const [tokensToStake, setTokensToStake] = useState<number>(0);
  const [lockupDuration, setLockupDuration] = useState<number>(0);
  const { needsSwitch, switchToCorrectChain, currentAppChain } =
    useCheckAndSwitchToActiveChain();
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
      {!isStakingLoading && !confirmStaking && (
        <>
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
            setIsStakingLoading={setIsStakingLoading}
            setConfirmStaking={setConfirmStaking}
          />
        </>
      )}

      {isStakingLoading && !confirmStaking && (
        <StakingLoadingState
          tokensToStake={tokensToStake}
          lockupDuration={lockupDuration}
        />
      )}

      {confirmStaking && (
        <StakingConfirmation
          tokensToStake={tokensToStake}
          lockupDuration={lockupDuration}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
};

export default StakingDrawerContent;
