"use client";

import { ProgressBar } from "@/components";
import Image from "next/image";
import { type CurrentPresaleRoundDetails } from "@/types/presale";

interface RaiseStatsProps {
  usdtBalance: number;
  presaleData: CurrentPresaleRoundDetails;
}

function RaiseStats({ usdtBalance, presaleData }: RaiseStatsProps) {
  const {
    roundDetails: { price, sales, allocation },
  } = presaleData ?? {
    roundDetails: { price: 0, sales: 0, allocation: 0 },
  };

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
            <span className="pl-2 text-[#808080]">USD</span>
          </h6>
        </div>
      </div>
      <div className="">
        <ProgressBar sales={sales} allocation={allocation} />
      </div>
      <div className="absolute left-[-15%] top-[-15%] -z-10 hidden md:block">
        <div className="relative">
          <Image
            src="/home-page/hero/designed-dots.png"
            alt="Decorative dots"
            width={75}
            height={75}
            priority
          />
          <div className="absolute left-[27%] top-[13%] h-[6px] w-[6px] animate-dot-pulse rounded-full bg-[#ff844f] [animation-delay:0ms]" />
          <div className="absolute left-[67%] top-[27%] h-[6px] w-[6px] animate-dot-pulse rounded-full bg-[#ff844f] [animation-delay:500ms]" />
          <div className="absolute left-[40%] top-[53%] h-[6px] w-[6px] animate-dot-pulse rounded-full bg-[#ff844f] [animation-delay:1000ms]" />
        </div>
      </div>
      <div className="absolute left-0 top-0 h-[580px] w-[200px] rotate-[24.3deg] rounded-full bg-[#E49048] opacity-10 blur-[200px]" />
    </div>
  );
}

export default RaiseStats;
