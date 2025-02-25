import Image from "next/image";
function PriceIncreaseTimer() {
  return (
    <div className="mt-4 flex justify-center relative">
      <div className="flex flex-col gap-4">
        <h1 className="font-funnel px-4 py-2 text-center text-[14px] font-medium leading-[14px] md:text-[16px] md:leading-[16px] lg:text-[18px] lg:leading-[18px]">
          Price Increase Timer
        </h1>
        <div className="flex flex-col justify-center gap-4 md:flex-row">
          <div className="flex gap-4">
            <div className="flex w-1/2 flex-col items-center rounded-md bg-black px-4 py-2 md:w-[100px] md:px-6 md:py-2">
              <h1 className="font-funnel text-[14px] leading-[49.32px] tracking-[-2.5%] text-[#A78BFA] md:text-[20px] lg:text-[24px]">
                Days
              </h1>
              <div className="font-funnel text-[20px] leading-[49.32px] tracking-[-2.5%] text-white md:text-[40px]">
                00
              </div>
            </div>
            <div className="flex w-1/2 flex-col items-center rounded-md bg-black px-6 py-2 md:w-[120px]">
              <h1 className="font-funnel text-[14px] leading-[49.32px] tracking-[-2.5%] text-[#A78BFA] md:text-[20px] lg:text-[24px]">
                Hours
              </h1>
              <div className="font-funnel text-[20px] leading-[49.32px] tracking-[-2.5%] text-white md:text-[40px]">
                00
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex w-1/2 flex-col items-center rounded-md bg-black px-6 py-2 md:w-[120px]">
              <h1 className="font-funnel text-[14px] leading-[49.32px] tracking-[-2.5%] text-[#A78BFA] md:text-[20px] lg:text-[24px]">
                Minutes
              </h1>
              <div className="font-funnel text-[20px] leading-[49.32px] tracking-[-2.5%] text-white md:text-[40px] ">
                00
              </div>
            </div>
            <div className="flex w-1/2 flex-col items-center rounded-md bg-black px-6 py-2 md:w-[120px]">
              <h1 className="font-funnel text-[14px] leading-[49.32px] tracking-[-2.5%] text-[#A78BFA] md:text-[20px] lg:text-[24px]">
                Seconds
              </h1>
              <div className="font-funnel text-[20px] leading-[49.32px] tracking-[-2.5%] text-white md:text-[40px] ">
                00
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -z-10 bottom-[-30%] left-[26%] hidden md:block">
        <Image
          src="/home-page/hero/center-dots.png"
          alt="Decorative dots"
          width={100}
          height={100}
          priority
        />
      </div>
      <div className="absolute bottom-0 right-0 h-[580px] w-[200px] rotate-[24.3deg] rounded-full bg-[#E49048] opacity-10 blur-[200px]" />
    </div>
  );
}

export default PriceIncreaseTimer;
