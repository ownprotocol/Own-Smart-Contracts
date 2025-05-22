"use client";

import ActionButtons from "./action-buttons";
import PresaleBanner from "./presale-banner";
import PriceIncreaseTimer from "./price-increase-timer";
import RaiseStats from "./raise-stats";
import { useHomePresalePage } from "@/hooks/use-home-presale-page";
import Loading from "@/app/loading";
import PresaleConcluded from "./has-presale-concluded";
import { usePresalePurchasesPage } from "@/hooks/use-presale-purchases-page";
import { useStakingPage } from "@/hooks/use-staking-page";
import { TimerCountdown } from "../timer-countdown";
import { Dots } from "./dots";

export const PresalePageContents = () => {
  const presalePageHook = useHomePresalePage();
  const presaleConcludedPageHook = usePresalePurchasesPage();
  const mainContentQuery = useStakingPage();

  if (
    presalePageHook.isLoading ||
    presaleConcludedPageHook.isLoading ||
    mainContentQuery.isLoading
  ) {
    return <Loading />;
  }

  const {
    presaleRound,
    timestamp,
    usdtBalance,
    usersOwnBalance,
    startPresaleTime,
    usersUSDTBalance,
  } = presalePageHook.data;

  const hasPresaleRoundStarted =
    presaleRound.roundsInProgress && presaleRound.hasPresaleStarted;

  return (
    <>
      <Dots />
      {!presaleRound.hasPresaleStarted && (
        <>
          <h1 className="header">Presale Starts In</h1>

          <TimerCountdown duration={timestamp - startPresaleTime} />
        </>
      )}
      {hasPresaleRoundStarted && (
        <>
          <PresaleBanner
            roundId={presaleRound.roundDetails.roundId}
            presaleAllocation={presaleRound.roundDetails.allocation}
            preSaleSold={presaleRound.roundDetails.sales}
          />
          <RaiseStats usdtBalance={usdtBalance} presaleData={presaleRound} />
          <PriceIncreaseTimer
            duration={
              presaleRound.endTime > timestamp
                ? presaleRound.endTime - timestamp
                : 0
            }
            label="PRICE INCREASE IN"
          />
          <ActionButtons
            usdtBalance={usersUSDTBalance}
            ownBalance={usersOwnBalance}
            ownPrice={presaleRound.roundDetails.price}
            refetch={presalePageHook.refetch}
            presaleAllocation={presaleRound.roundDetails.allocation}
            preSaleSold={presaleRound.roundDetails.sales}
          />
        </>
      )}
      {!presaleRound.roundsInProgress && presaleRound.hasPresaleStarted && (
        <PresaleConcluded
          presalePurchases={presaleConcludedPageHook.data.presalePurchases}
          refetch={presaleConcludedPageHook.refetch}
          hasRewardsToClaim={presaleConcludedPageHook.data.hasRewardsToClaim}
          ownBalance={mainContentQuery.data.ownBalance}
        />
      )}
    </>
  );
};
