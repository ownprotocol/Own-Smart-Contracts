"use client";

import ActionButtons from "./action-buttons";
import PresaleBanner from "./presale-banner";
import PriceIncreaseTimer from "./price-increase-timer";
import RaiseStats from "./raise-stats";
import { useHomePresalePage } from "@/hooks/use-home-presale-page";
import Loading from "@/app/loading";
import { useGetAuthUser } from "@/query";
import { useChainSwitch } from "@/providers/network-switch-provider";
import { useRouter } from "next/navigation";
import { BlurredStakingBoard } from "..";
import { NetworkSwitchDialog } from "..";

export const PresalePageContents = () => {
  const presalePageHook = useHomePresalePage();
  const router = useRouter();
  const authUser = useGetAuthUser();
  const { needsSwitch, switchToCorrectChain, currentAppChain } =
    useChainSwitch();

  const handleDialogClose = () => {
    router.push("/");
  };

  if (presalePageHook.isLoading) {
    return <Loading />;
  }

  if (needsSwitch && authUser.isValid) {
    return (
      <main className="min-h-screen px-[5%] pt-[10%] md:px-[10%] md:pt-[3%]">
        <NetworkSwitchDialog
          title={`Switch to view your rewards on ${currentAppChain?.name}`}
          isOpen={needsSwitch}
          onClose={handleDialogClose}
          onSwitch={switchToCorrectChain}
          networkName={currentAppChain?.name ?? ""}
        />
        <BlurredStakingBoard />
      </main>
    );
  }
  return (
    <>
      <PresaleBanner
        roundId={presalePageHook.data.presaleRound.roundDetails.roundId}
      />
      {presalePageHook.data.presaleRound.roundsInProgress &&
        presalePageHook.data.startPresaleTime <
          presalePageHook.data.timestamp && (
          <>
            <RaiseStats
              usdtBalance={presalePageHook.data.usdtBalance}
              presaleData={presalePageHook.data.presaleRound}
            />
            <PriceIncreaseTimer
              endTime={presalePageHook.data.presaleRound.endTime}
              timestamp={presalePageHook.data.timestamp}
            />
            <ActionButtons
              usdtBalance={presalePageHook.data.usersUSDTBalance}
              ownBalance={presalePageHook.data.usersOwnBalance}
              ownPrice={presalePageHook.data.presaleRound.roundDetails.price}
              refetch={presalePageHook.refetch}
              authUserIsValid={authUser.isValid ?? false}
            />
          </>
        )}
      {!presalePageHook.data.presaleRound.roundsInProgress && (
        <div>Presale rounds have finished</div> // Lazy styling for now
      )}
      {presalePageHook.data.startPresaleTime >
        presalePageHook.data.timestamp && (
        <div>Presale hasn&apos;t started yet</div>
      )}
    </>
  );
};
