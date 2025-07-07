"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { displayedEthAmount } from "@/lib/display";

import { SquareDots } from "@/components";
import { Button } from "../ui/button";
import PresalePurchasesTable from "../presale/presale-purchases-table";
import { type PresalePurchase } from "@/types/presale";
import { useClaimRewards } from "@/hooks/use-presale-claim-rewards";
import { useActiveAccount } from "thirdweb/react";
import { useContracts } from "@/hooks";
import { orderBy, uniqBy } from "lodash";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getBlockExplorerTxUrl } from "@/lib/explorer";
import { useActiveChainWithDefault } from "@/hooks/useChainWithDefault";
import { type SupportedNetworkIds } from "@fasset/contracts";

interface PresaleConcludedProps {
  presalePurchases: PresalePurchase[];
  refetch: () => Promise<void>;
  hasRewardsToClaim: boolean;
  ownBalance: number;
}

function PresaleConcluded({
  presalePurchases,
  refetch,
  hasRewardsToClaim,
  ownBalance,
}: PresaleConcludedProps) {
  const account = useActiveAccount();
  const chain = useActiveChainWithDefault();
  const [activeRound] = useState<number | null>(null);
  const { claimRewards, isLoading: isClaimLoading } = useClaimRewards(refetch);
  const { ownTokenContract } = useContracts();
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

  return (
    <div className="relative w-full">
      <SquareDots />
      <h1 className="header">$Own Token Presale Concluded</h1>
      <p className="mt-2 min-h-[100px] font-['DM_Sans'] text-[20px] font-[400] leading-[24px] text-[#B4B4B4] md:mt-0 md:min-h-[100px] md:text-[32px] md:leading-[42px]">
        Thanks for participating! You can claim your $Own after TGE and will be
        able to stake them to earn rewards.
      </p>

      <div className="pt-4">
        <div className="flex flex-col gap-4 md:flex-row md:gap-12">
          <div>
            <p className="pt-2 font-dm_mono text-[12px] font-[400] uppercase leading-[12px] tracking-[0.08em] text-[#B4B4B4] md:text-[14px] md:leading-[14px]">
              YOUR $OWN
            </p>
            <div className="flex items-center gap-2">
              <Image
                src="/own-dark.png"
                alt="Subtract icon"
                width={10}
                height={10}
                className="h-[10px] w-[10px] md:h-[20px] md:w-[20px]"
              />
              <p className="font-dm_mono text-[12px] font-[400] text-white md:text-[24px]">
                {displayedEthAmount(ownBalance)}
              </p>
            </div>
          </div>
          <Link
            href={getBlockExplorerTxUrl(
              ownTokenContract.address,
              chain.id as SupportedNetworkIds,
            )}
            className="flex items-center gap-2 hover:underline"
            target="_blank"
          >
            View Own Contract
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        {uniqueRounds.length > 0 && (
          <>
            <h1 className="mt-8 align-middle font-['DM_Sans'] text-[14px] font-[400] leading-[100%] tracking-[-0.03em] text-white md:text-[16px]">
              Your Purchase History
            </h1>
          </>
        )}

        <PresalePurchasesTable rows={filteredPurchases} showTitle={false} />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row md:justify-start md:gap-4">
          <Button
            variant={"mainButton"}
            size="lg"
            onClick={claimRewards}
            disabled={isClaimLoading || !account || !hasRewardsToClaim}
            useSpinner
          >
            Claim Now
          </Button>
          <Button
            variant={"secondary"}
            size="lg"
            onClick={() => {
              window.open(
                "https://play.google.com/store/apps/details?id=com.mexcpro.client&pcampaignid=web_share&pli=1",
                "_blank",
              );
            }}
          >
            Buy more in MEXC
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PresaleConcluded;
