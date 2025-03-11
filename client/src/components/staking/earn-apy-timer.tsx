"use client";

import Image from "next/image";
import { useTimer } from "react-timer-hook";

function EarnAPYTimer() {
  const { days, hours, minutes, seconds } = useTimer({
    expiryTimestamp: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });
  return (
    <div className="relative flex min-h-[100px] justify-center pt-4 md:pt-12">
      <div className="flex flex-col gap-4">
        <h1 className="font-funnel px-4 py-2 text-center text-[14px] font-[500] leading-[14px] md:text-[16px] md:leading-[16px] lg:text-[20px] lg:leading-[20px]">
          EARN <span className="text-orange-500">10X</span> APY FOR NEXT
        </h1>
        <div className="flex flex-col justify-center gap-4 md:flex-row">
          <div className="flex gap-4">
            <TimerBox label="Days" value={days} />
            <TimerBox label="Hours" value={hours} />
          </div>
          <div className="flex gap-4">
            <TimerBox label="Minutes" value={minutes} />
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
      <div className="absolute inset-0 h-[580px] w-[100px] rotate-[24.3deg] rounded-full bg-[#E49048] opacity-10 blur-[200px]" />

      <div className="absolute right-[-15%] top-[-15%] -z-10 hidden md:block">
        <Image
          src="/home-page/hero/designed-dots.png"
          alt="Decorative dots"
          width={75}
          height={75}
          priority
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
    </div>
  );
}
type TimerBoxProps = {
  label: string;
  value: number;
};

function TimerBox({ label, value }: TimerBoxProps) {
  const formattedValue = value.toString().padStart(2, "0");
  return (
    <div className="flex w-1/2 flex-col items-center rounded-md bg-black px-6 py-2 md:w-[120px]">
      <h1 className="font-funnel text-[14px] tracking-[-2.5%] text-[#A78BFA] md:text-[20px] lg:text-[24px]">
        {label}
      </h1>
      <div className="font-funnel text-[20px] tracking-[-2.5%] text-white md:text-[40px]">
        {formattedValue}
      </div>
    </div>
  );
}
export default EarnAPYTimer;
