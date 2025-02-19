import { ProgressBar } from "./progress-bar";

const RaiseStats = () => {
  // TODO make these real
  const amountRaised = "$1,030,000";
  const usdPrice = "$1.2";
  return (
    <div className="mt-[10%] flex flex-col gap-4">
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

      <ProgressBar sold={12000} cap={30000} />
    </div>
  );
};

export default RaiseStats;
