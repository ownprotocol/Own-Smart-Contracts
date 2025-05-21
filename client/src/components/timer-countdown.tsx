import { useMinimalCountdown } from "@/hooks/use-minimal-countdown";

interface TimerCountdownProps {
  duration: number;
}

export const TimerCountdown = (props: TimerCountdownProps) => {
  const duration = useMinimalCountdown(props.duration);

  return (
    <div className="flex flex-col justify-center gap-4 md:flex-row">
      <div className="flex gap-4">
        <TimerBox label="Days" value={duration.days} />
        <TimerBox label="Hours" value={duration.hours} />
      </div>
      <div className="flex gap-4">
        <TimerBox label="Minutes" value={duration.minutes} />
        <TimerBox label="Seconds" value={duration.seconds} />
      </div>
    </div>
  );
};

interface TimerBoxProps {
  label: string;
  value?: number;
}

function TimerBox({ label, value }: TimerBoxProps) {
  const formattedValue = (value ?? 0).toString().padStart(2, "0");
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
