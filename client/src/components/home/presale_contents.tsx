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
import { queryHookUnifier } from "@/helpers/query-hook-unifier";

export const PresalePageContents = () => {
  const queryHooks = queryHookUnifier({
    presalePageHook: useHomePresalePage(),
    presaleConcludedPageHook: usePresalePurchasesPage(),
    mainContentQuery: useStakingPage(),
  });

  if (queryHooks.isLoading) {
    return <Loading />;
  }

  const {
    presalePageHook: {
      presaleRound,
      timestamp,
      usdtBalance,
      usersOwnBalance,
      startPresaleTime,
      usersUSDTBalance,
    },
    presaleConcludedPageHook: { presalePurchases, hasRewardsToClaim },
    mainContentQuery: { ownBalance },
  } = queryHooks.data;

  const hasPresaleRoundStarted =
    presaleRound.roundsInProgress && presaleRound.hasPresaleStarted;

  return (
    <>
      <Dots />
      {!presaleRound.hasPresaleStarted && (
        <>
          <h1 className="header">Presale Starts In</h1>

          <TimerCountdown duration={startPresaleTime - timestamp} />
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
            refetch={queryHooks.refetch}
            presaleAllocation={presaleRound.roundDetails.allocation}
            preSaleSold={presaleRound.roundDetails.sales}
          />
        </>
      )}
      {!presaleRound.roundsInProgress && presaleRound.hasPresaleStarted && (
        <PresaleConcluded
          presalePurchases={presalePurchases}
          refetch={queryHooks.refetch}
          hasRewardsToClaim={hasRewardsToClaim}
          ownBalance={ownBalance}
        />
      )}
    </>
  );
};
