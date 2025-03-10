"use client";

import { ProgressBar, RaiseStatsSkeleton } from "@/components";
import Image from "next/image";
import { useGetBalanceUSDT, useGetCurrentPresaleRound } from "@/hooks";
import { PresaleAddress } from "@/constants/contracts";
function RaiseStats() {
  const { usdtBalance, isLoading: isLoadingPresaleBalance } =
    useGetBalanceUSDT(PresaleAddress);

  const { presaleData, isLoading: isLoadingPresaleRound } =
    useGetCurrentPresaleRound();

  if (isLoadingPresaleBalance || isLoadingPresaleRound || !presaleData) {
    return <RaiseStatsSkeleton />;
  }

  const {
    round: { price, sales, allocation },
  } = presaleData;

  return (
    <div className="relative flex flex-col gap-4 md:mt-1 md:min-h-[200px]">
      <div className="flex w-full flex-row">
        <div className="flex w-1/2 flex-col">
          <h5 className="font-dmMono mb-2 text-[14px] font-normal leading-[14px] text-[#808080]">
            TOTAL RAISED
          </h5>
          <h6 className="font-dmSans text-[22px] font-medium leading-[22px]">
            ${usdtBalance}
          </h6>
        </div>
        <div className="flex w-1/2 flex-col">
          <h5 className="font-dmMono mb-2 text-[14px] font-normal leading-[14px] text-[#808080]">
            $OWN PRICE
          </h5>
          <h6 className="font-dmSans text-[22px] font-medium leading-[22px]">
            ${price}
            <span className="text-[#808080]">USD</span>
          </h6>
        </div>
      </div>
      <div className="">
        <ProgressBar
          sales={sales ? sales : 12000}
          allocation={allocation ? allocation : 30000}
        />
      </div>
      <div className="absolute left-[-15%] top-[-15%] -z-10 hidden md:block">
        <Image
          src="/home-page/hero/designed-dots.png"
          alt="Decorative dots"
          width={75}
          height={75}
          priority
        />
      </div>
      <div className="absolute left-0 top-0 h-[580px] w-[200px] rotate-[24.3deg] rounded-full bg-[#E49048] opacity-10 blur-[200px]" />
    </div>
  );
}

export default RaiseStats;
