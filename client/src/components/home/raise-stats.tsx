"use client";

import { ProgressBar } from "@/components";
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
    <div className="relative flex w-full max-w-4xl flex-col gap-4 md:mt-1 md:min-h-[200px]">
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
    </div>
  );
}

export default RaiseStats;
