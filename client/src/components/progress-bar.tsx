"use client";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  sold: number;
  cap: number;
  className?: string;
}

export function ProgressBar({ sold, cap, className }: ProgressBarProps) {
  const progress = (sold / cap) * 100;

  return (
    <div
      className={cn(
        "relative h-[105px] w-full overflow-hidden rounded-lg bg-purple-950",
        className,
      )}
    >
      {/* Gradient progress bar */}
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-amber-400 transition-all duration-500"
        style={{ width: `${progress}%` }}
      />

      {/* Text labels */}
      <div className="relative flex h-full items-center justify-between px-4 font-medium text-white">
        <div>
          <span className="text-xs opacity-80">SOLD</span>
          <p className="text-lg">{sold.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <span className="text-xs opacity-80">PRESALE CAP</span>
          <p className="text-lg">{cap.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
