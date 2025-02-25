"use client";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  sold: number;
  cap: number;
  className?: string;
}

function ProgressBar({ sold, cap, className }: ProgressBarProps) {
  const progress = (sold / cap) * 100;

  return (
    <div
      className={cn(
        "relative h-[75px] w-full overflow-hidden rounded-lg bg-purple-950 pt-4 md:h-[105px]",
        className,
      )}
    >
      {/* Gradient progress bar */}
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-amber-400 transition-all duration-500"
        style={{
          width: `${progress}%`,
          clipPath:
            "polygon(0 0, 70% 0, calc(70% + 20px) 50%, 70% 100%, 0 100%)",
        }}
      />

      {/* Orange glow effect - moved outside the clipped div */}
      <div
        className="absolute inset-y-0 left-0 transition-all duration-500"
        style={{ width: `${progress}%` }}
      >
        {/* Orange glow effect with consistent gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-r"
          style={{
            background:
              "linear-gradient(to right, rgba(245, 158, 11, 0.4), rgba(245, 158, 11, 0.4) 60%, rgba(251, 146, 60, 0.2) 80%, rgba(251, 146, 60, 0) 100%)",
            filter: "blur(16px) brightness(1.2)",
          }}
        />

        <ProgressDots />
      </div>

      {/* Text labels */}
      <div className="relative flex h-full items-center justify-between px-4 font-medium text-white">
        <div>
          <span className="font-dm_mono text-[10px] font-normal leading-[10px] tracking-[0.08em] opacity-80 md:text-[14px] md:leading-[14px]">
            SOLD
          </span>
          <p className="font-dm_sans text-base font-medium leading-[40px] tracking-[-0.06em] md:text-[40px]">
            {sold.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <span className="font-dm_mono text-[10px] font-normal leading-[10px] tracking-[0.08em] opacity-80 md:text-[14px] md:leading-[14px]">
            PRESALE CAP
          </span>
          <p className="font-dm_sans text-base font-medium leading-[40px] tracking-[-0.06em] md:text-[40px]">
            {cap.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function ProgressDots() {
  return (
    <>
      <div className="absolute left-[75%] top-[15%] flex -translate-y-1/2 gap-1">
        <div className="h-2 w-2 rounded-full bg-orange-300"></div>
      </div>
      <div className="absolute left-[81%] top-[38%] flex -translate-y-1/2 gap-1">
        <div className="h-1 w-1 rounded-full bg-orange-300"></div>
      </div>
      <div className="absolute left-[78%] top-[52%] flex -translate-y-1/2 gap-1">
        <div className="h-3 w-3 rounded-full bg-orange-300"></div>
      </div>
      <div className="absolute left-[84%] top-[72%] flex -translate-y-1/2 gap-1">
        <div className="h-1.5 w-1.5 rounded-full bg-orange-300"></div>
      </div>
      <div className="absolute left-[80%] top-[85%] flex -translate-y-1/2 gap-1">
        <div className="h-2 w-2 rounded-full bg-orange-300"></div>
      </div>
    </>
  );
}

export default ProgressBar;
