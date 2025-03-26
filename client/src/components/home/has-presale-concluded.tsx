"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { SquareDots } from "@/components";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import PresalePurchasesTable from "../presale/presale-purchases-table";
import { type PresalePurchase } from "@/types/presale";
import { useClaimRewards } from "@/hooks/use-presale-claim-rewards";
import { useActiveAccount } from "thirdweb/react";
import { useContracts } from "@/hooks";
import { orderBy, uniqBy } from "lodash";

interface HasPresaleConcludedProps {
  presalePurchases: PresalePurchase[];
  refetch: () => Promise<void>;
  hasRewardsToClaim: boolean;
}

function HasPresaleConcluded({
  presalePurchases,
  refetch,
  hasRewardsToClaim,
}: HasPresaleConcludedProps) {
  const account = useActiveAccount();
  const [activeRound, setActiveRound] = useState<number | null>(null);
  const { claimRewards, isLoading: isClaimLoading } = useClaimRewards(refetch);
  const { presaleContract } = useContracts();
  const uniqueRounds = orderBy(
    uniqBy(presalePurchases, (value) => value.roundId),
    "roundId",
    "asc",
  );

  const filteredPurchases = useMemo(() => {
    if (activeRound === null) {
      return presalePurchases;
    }

    return presalePurchases.filter(
      (purchase) => purchase.roundId === activeRound,
    );
  }, [presalePurchases, activeRound]);

  const handleSetRoundOnClick = (roundId: number) => {
    if (roundId === activeRound) {
      setActiveRound(null);
    } else {
      setActiveRound(roundId);
    }
  };

  return (
    <div className="relative h-screen w-full">
      <SquareDots />
      <div className="container mx-auto max-w-[1000px]">
        <h1 className="font-funnel flex max-w-[750px] items-center px-8 pb-2 text-[32px] font-[400] leading-[42px] tracking-[-5%] md:px-0 md:pb-8 md:text-[72px] md:leading-[72px]">
          $Own Token Presale Concluded
        </h1>
        <p className="mt-4 min-h-[100px] px-8 font-['DM_Sans'] text-[20px] font-[400] leading-[32px] text-[#B4B4B4] md:min-h-[100px] md:px-0 md:text-[32px] md:leading-[42px]">
          Thanks for participating! You can claim your $Own after TGE and will
          be able to stake them to earn rewards.
        </p>

        <div className="px-8 pt-4 md:px-0">
          <div className="flex flex-col gap-4 md:flex-row md:gap-12">
            <div>
              <p className="pt-2 font-dm_mono text-[12px] font-[400] uppercase leading-[12px] tracking-[0.08em] text-[#B4B4B4] md:text-[14px] md:leading-[14px]">
                YOUR $OWN
              </p>
              <div className="flex items-center gap-2">
                <Image
                  src="/home-page/hero/subtract.png"
                  alt="Subtract icon"
                  width={20}
                  height={20}
                />
                <p className="font-dm_mono text-[24px] font-[400] text-white md:text-[32px]">
                  30,000
                </p>
              </div>
            </div>
            <div>
              <p className="pt-2 font-dm_mono text-[12px] font-[400] uppercase leading-[12px] tracking-[0.08em] text-[#B4B4B4] md:text-[14px] md:leading-[14px]">
                CONTRACT ADDRESS FOR $OWN
              </p>
              <p className="font-dm_mono text-[20px] font-[400] text-white md:text-[32px]">
                {presaleContract.address}
              </p>
            </div>
          </div>
          <div className="mt-8 sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <div className="flex flex-wrap gap-2 pt-4 text-xs md:flex-row md:flex-wrap md:gap-2 md:text-base">
                {uniqueRounds.map((round) => (
                  <button
                    type="button"
                    key={round.roundId}
                    className={cn(
                      "cursor-pointer rounded-full px-4 py-1 text-white",
                      activeRound === round.roundId
                        ? "cursor-pointer bg-orange-500"
                        : "bg-[#C1691180] text-[#F1AF6E]",
                    )}
                    onClick={() => {
                      handleSetRoundOnClick(round.roundId);
                    }}
                  >
                    Round {round.roundId + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <PresalePurchasesTable rows={filteredPurchases} />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row md:justify-start md:gap-4">
            <Button
              className="font-funnel bg-[#C58BFF] px-8 py-6 text-[14px] font-medium leading-[14px] tracking-[0%] text-black hover:bg-[#E49048] md:text-[16px] md:leading-[16px]"
              onClick={claimRewards}
              disabled={isClaimLoading || !account || !hasRewardsToClaim}
              useSpinner
            >
              Claim Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HasPresaleConcluded;

// <Button
//   className="font-funnel bg-black px-8 py-6 text-[14px] leading-[14px] tracking-[0%] text-white hover:bg-gray-900 md:text-[16px] md:leading-[16px]"
//   onClick={() => {
//     console.log("Buy more in MEXC");
//   }}
// >
//   Buy more in MEXC
// </Button>;
