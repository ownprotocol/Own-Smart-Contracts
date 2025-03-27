/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import ActionButtons from "./action-buttons";
import PresaleBanner from "./presale-banner";
import PriceIncreaseTimer from "./price-increase-timer";
import RaiseStats from "./raise-stats";
import { useHomePresalePage } from "@/hooks/use-home-presale-page";
import Loading from "@/app/loading";
import { useGetAuthUser } from "@/query";
import HasPresaleConcluded from "./has-presale-concluded";
import { usePresalePurchasesPage } from "@/hooks/use-presale-purchases-page";
import { useStakingPage } from "@/hooks/use-staking-page";

export const PresalePageContents = () => {
  const presalePageHook = useHomePresalePage();
  const presaleConcludedPageHook = usePresalePurchasesPage();
  const { mainContentQuery } = useStakingPage();
  const authUser = useGetAuthUser();

  if (presalePageHook.isLoading || presaleConcludedPageHook.isLoading || mainContentQuery.isLoading) {
    return <Loading />;
  }
  console.log(presalePageHook.data);
  console.log(presalePageHook.data.presaleRound.roundsInProgress, presalePageHook.data.startPresaleTime <
    presalePageHook.data.timestamp );

    const hasPresaleRoundStarted = presalePageHook.data.presaleRound.roundsInProgress &&
    presalePageHook.data.startPresaleTime <=
      presalePageHook.data.timestamp;

  return (
    <>
      {hasPresaleRoundStarted && (
        <>
          <PresaleBanner
            roundId={presalePageHook.data.presaleRound.roundDetails.roundId}
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
              authUserIsValid={authUser.isValid ?? false}
            />
          </>
        )}
      {!presalePageHook.data.presaleRound.roundsInProgress && (
        <div className="py-1 md:py-4 -mb-2">
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
