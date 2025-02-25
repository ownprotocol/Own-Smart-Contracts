import { ProgressBar } from "@/components";
import Image from "next/image";

function RaiseStats() {
  // TODO make these real
  const amountRaised = "$1,030,000";
  const usdPrice = "$1.2";
  return (
    <div className="relative mt-[10%] flex flex-col gap-4 md:mt-[3%]">
      <div className="flex w-full flex-row">
        <div className="flex w-1/2 flex-col">
          <h5 className="font-dmMono mb-2 text-[14px] font-normal leading-[14px] text-[#808080]">
            TOTAL RAISED
          </h5>
          <h6 className="font-dmSans text-[22px] font-medium leading-[22px]">
            {amountRaised}
          </h6>
        </div>
        <div className="flex w-1/2 flex-col">
          <h5 className="font-dmMono mb-2 text-[14px] font-normal leading-[14px] text-[#808080]">
            $OWN PRICE
          </h5>
          <h6 className="font-dmSans text-[22px] font-medium leading-[22px]">
            {usdPrice}
            <span className="text-[#808080]">USD</span>
          </h6>
        </div>
      </div>
      <div className="pt-4">
        <ProgressBar sold={12000} cap={30000} />
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
      <div className="absolute top-0 left-0 h-[580px] w-[200px] rotate-[24.3deg] rounded-full bg-[#E49048] opacity-10 blur-[200px]" />
    </div>
  );
}

export default RaiseStats;
