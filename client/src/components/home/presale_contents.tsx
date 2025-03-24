"use client";

import ActionButtons from "./action-buttons";
import PresaleBanner from "./presale-banner";
import PriceIncreaseTimer from "./price-increase-timer";
import RaiseStats from "./raise-stats";
import { useHomePresalePage } from "@/hooks/use-home-presale-page";
import Loading from "@/app/loading";

export const PresalePageContents = () => {
  const presalePageHook = useHomePresalePage();

  if (presalePageHook.isLoading) {
    return <Loading />;
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
