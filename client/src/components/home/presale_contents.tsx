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

export const PresalePageContents = () => {
  const presalePageHook = useHomePresalePage();
  const presaleConcludedPageHook = usePresalePurchasesPage();
  const authUser = useGetAuthUser();

  if (presalePageHook.isLoading || presaleConcludedPageHook.isLoading) {
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
              authUserIsValid={authUser.isValid ?? false}
            />
          </>
        )}
      {!presalePageHook.data.presaleRound.roundsInProgress && (
        <div>
          <HasPresaleConcluded presalePurchases={presaleConcludedPageHook.data.presalePurchases} isLoading={presaleConcludedPageHook.isLoading} refetch={presaleConcludedPageHook.refetch}/>
        </div>
      )}
      {presalePageHook.data.startPresaleTime >
        presalePageHook.data.timestamp && (
        <div>Presale hasn&apos;t started yet</div>
      )}
    </>
  );
};
