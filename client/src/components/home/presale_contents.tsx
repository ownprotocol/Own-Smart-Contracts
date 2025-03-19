"use client";

import ActionButtons from "./action-buttons";
import PresaleBanner from "./presale-banner";
import PriceIncreaseTimer from "./price-increase-timer";
import RaiseStats from "./raise-stats";
import PriceIncreaseTimerSkeleton from "../ui/loading-skeletons/price-increase-timer-skeleton";
import RaiseStatsSkeleton from "../ui/loading-skeletons/raise-stats-skeleton";
import { usePresalePage } from "@/hooks/use-presale-page";

export const PresalePageContents = () => {
  const presalePageHook = usePresalePage();

  if (presalePageHook.isLoading) {
    return (
      <>
        <PresaleBanner roundId={null} />
        <RaiseStatsSkeleton />
        <PriceIncreaseTimerSkeleton />
        <ActionButtons disabled={true} />
      </>
    );
  }

  return (
    <>
      <PresaleBanner roundId={presalePageHook.data.presaleRound.roundId} />
      {presalePageHook.data.presaleRound.roundsInProgress && (
        <>
          <RaiseStats
            usdtBalance={presalePageHook.data.usdtBalance}
            presaleData={presalePageHook.data.presaleRound}
          />
          <PriceIncreaseTimer
            endTime={presalePageHook.data.presaleRound.endTime}
          />
          <ActionButtons />
        </>
      )}
      {!presalePageHook.data.presaleRound.roundsInProgress && (
        <div>Presale rounds have finished</div> // Lazy styling for now
      )}
    </>
  );
};
