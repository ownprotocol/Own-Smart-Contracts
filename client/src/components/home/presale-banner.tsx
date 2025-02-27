"use client";

import { PresaleBannerSkeleton } from "@/components";

interface PresaleBannerProps {
  isLoading: boolean;
}

function PresaleBanner({ isLoading }: PresaleBannerProps) {
  if (isLoading) {
    return <PresaleBannerSkeleton  />;
  }

  return (
    <div className="relative min-h-[200px]">
      {/* Glow effect */}
      <div className="absolute inset-0 h-[580px] w-[100px] rotate-[24.3deg] rounded-full bg-[#E49048] opacity-10 blur-[200px]" />

      <div className="flex flex-col items-center gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="font-funnel max-w-[650px] items-center text-[32px] font-[400] leading-[52px] tracking-[-5%] md:text-[72px] md:leading-[72px] self-start">
          Buy $Own Token in Presale Now
        </h1>
        <div className="flex w-full justify-start md:w-1/4 md:justify-end">
          <span className="pt-2 rounded-full bg-[#C1691180] px-2 py-1.5 text-sm md:text-xs font-normal uppercase tracking-wider text-[#F1AF6E]">
            Phase 1
          </span>
        </div>
      </div>
    </div>
  );
}

export default PresaleBanner;
