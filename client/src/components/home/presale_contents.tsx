"use client";

import ActionButtons from "./action-buttons";
import PresaleBanner from "./presale-banner";
import PriceIncreaseTimer from "./price-increase-timer";
import RaiseStats from "./raise-stats";
import PriceIncreaseTimerSkeleton from "../ui/loading-skeletons/price-increase-timer-skeleton";
import RaiseStatsSkeleton from "../ui/loading-skeletons/raise-stats-skeleton";
import { useHomePresalePage } from "@/hooks/use-home-presale-page";
import ConnectWalletButton from "../connect-wallet-button";

export const PresalePageContents = () => {
  const presalePageHook = useHomePresalePage();

  if (presalePageHook.isLoading) {
    return (
      <>
        <PresaleBanner roundId={null} />
        <RaiseStatsSkeleton />
        <PriceIncreaseTimerSkeleton />
        <ConnectWalletButton
          bgColor="black"
          textColor="white"
          isHoverable={false}
          className="!font-funnel !mt-4 !cursor-pointer !font-semibold"
        />
      </>
    );
  }
  console.log(presalePageHook.data);

  return (
    <>
      <PresaleBanner
        roundId={presalePageHook.data.presaleRound.roundDetails.roundId}
      />
      {presalePageHook.data.presaleRound.roundsInProgress && (
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
          />
        </>
      )}
      {!presalePageHook.data.presaleRound.roundsInProgress && (
        <div>Presale rounds have finished</div> // Lazy styling for now
      )}
    </>
  );
};
