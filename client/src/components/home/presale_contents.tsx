"use client";

import ActionButtons from "./action-buttons";
import PresaleBanner from "./presale-banner";
import PriceIncreaseTimer from "./price-increase-timer";
import RaiseStats from "./raise-stats";
import { useHomePresalePage } from "@/hooks/use-home-presale-page";
import Loading from "@/app/loading";
import HasPresaleConcluded from "./has-presale-concluded";
import { usePresalePurchasesPage } from "@/hooks/use-presale-purchases-page";
import { useStakingPage } from "@/hooks/use-staking-page";

export const PresalePageContents = () => {
  const presalePageHook = useHomePresalePage();
  const presaleConcludedPageHook = usePresalePurchasesPage();
  const { mainContentQuery } = useStakingPage();

  if (
    presalePageHook.isLoading ||
    presaleConcludedPageHook.isLoading ||
    mainContentQuery.isLoading
  ) {
    return <Loading />;
  }

  const hasPresaleRoundStarted =
    presalePageHook.data.presaleRound.roundsInProgress &&
    presalePageHook.data.startPresaleTime <= presalePageHook.data.timestamp;

  return (
    <>
      {hasPresaleRoundStarted && (
        <>
          <PresaleBanner
            roundId={presalePageHook.data.presaleRound.roundDetails.roundId}
            presaleAllocation={
              presalePageHook.data.presaleRound.roundDetails.allocation
            }
            preSaleSold={presalePageHook.data.presaleRound.roundDetails.sales}
          />
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
            presaleAllocation={
              presalePageHook.data.presaleRound.roundDetails.allocation
            }
            preSaleSold={presalePageHook.data.presaleRound.roundDetails.sales}
          />
        </>
      )}
      {!presalePageHook.data.presaleRound.roundsInProgress && (
        <div className="-mb-2 py-1 md:py-4">
          <HasPresaleConcluded
            presalePurchases={presaleConcludedPageHook.data.presalePurchases}
            refetch={presaleConcludedPageHook.refetch}
            hasRewardsToClaim={presaleConcludedPageHook.data.hasRewardsToClaim}
            ownBalance={mainContentQuery.data.ownBalance}
          />
        </div>
      )}
    </>
  );
};
