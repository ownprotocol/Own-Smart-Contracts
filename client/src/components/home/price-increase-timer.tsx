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
      <div className="absolute left-0 top-44 -z-10 hidden md:block">
        <Image
          src="/home-page/hero/center-dots.png"
          alt="Decorative dots"
          width={75}
          height={75}
          priority
        />
      </div>
    </div>
  );
}

export default PriceIncreaseTimer;
