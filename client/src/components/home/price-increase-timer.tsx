"use client";

import Image from "next/image";
import { TimerCountdown } from "../timer-countdown";

interface PriceIncreaseTimerProps {
  duration: number;
  label: string;
}

function PriceIncreaseTimer({ duration, label }: PriceIncreaseTimerProps) {
  return (
    <div className="relative mt-4 flex min-h-[100px] justify-center md:mt-0">
      <div className="flex flex-col gap-4">
        <h1 className="font-funnel px-4 py-2 text-center text-[14px] font-normal leading-[14px] md:text-[16px] md:leading-[16px] lg:text-[18px] lg:leading-[18px]">
          {label}
        </h1>
        <div className="flex flex-col justify-center gap-4 md:flex-row">
          <TimerCountdown duration={duration} />
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
      <div className="absolute inset-0 h-[580px] w-[100px] rotate-[24.3deg] rounded-full bg-[#E49048] opacity-10 blur-[200px]" />

      <div className="absolute right-[-15%] top-[-15%] -z-10 hidden md:block">
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
    </div>
  );
}

export default PriceIncreaseTimer;
