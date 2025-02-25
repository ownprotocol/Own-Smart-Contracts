"use client";

import Image from "next/image";
import { useTimer } from "react-timer-hook";

function PriceIncreaseTimer() {
  const { hours, minutes, seconds } = useTimer({
    expiryTimestamp: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });
  return (
    <div className="relative mt-4 flex justify-center">
      <div className="flex flex-col gap-4">
        <h1 className="font-funnel px-4 py-2 text-center text-[14px] font-medium leading-[14px] md:text-[16px] md:leading-[16px] lg:text-[18px] lg:leading-[18px]">
          Price Increase Timer
        </h1>
        <div className="flex flex-col justify-center gap-4 md:flex-row">
        <div className="flex gap-4">
            <TimerBox label="Days" value={hours} />
            <TimerBox label="Hours" value={minutes} />
          </div>
          <div className="flex gap-4">
            <TimerBox label="Minutes" value={seconds} />
            <TimerBox label="Seconds" value={seconds} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-[-30%] left-[26%] -z-10 hidden md:block">
        <Image
          src="/home-page/hero/center-dots.png"
          alt="Decorative dots"
          width={75}
          height={75}
          priority
        />
      </div>
      <div className="absolute bottom-0 right-0 h-[580px] w-[200px] rotate-[24.3deg] rounded-full bg-[#E49048] opacity-10 blur-[200px]" />

      <div className="absolute right-[-15%] top-[-15%] -z-10 hidden md:block">
        <Image
          src="/home-page/hero/designed-dots.png"
          alt="Decorative dots"
          width={75}
          height={75}
          priority
        />
      </div>
    </div>
  );
}

type TimerBoxProps = {
  label: string;
  value: number;
};

function TimerBox({ label, value }: TimerBoxProps) {
  return (
    <div className="flex w-1/2 flex-col items-center rounded-md bg-black px-6 py-2 md:w-[120px]">
      <h1 className="font-funnel text-[14px] leading-[49.32px] tracking-[-2.5%] text-[#A78BFA] md:text-[20px] lg:text-[24px]">
        {label}
      </h1>
      <div className="font-funnel text-[20px] leading-[49.32px] tracking-[-2.5%] text-white md:text-[40px]">
        {value}
      </div>
    </div>
  );
}

export default PriceIncreaseTimer;
