function PresaleBannerSkeleton() {
  return (
    <div className="relative min-h-[200px]">
      {/* Glow effect */}
      <div className="absolute right-0 top-0 h-[580px] w-[50px] md:w-[200px] rotate-[24.3deg] rounded-full bg-[#E49048] opacity-10 blur-[200px]" />

      <div className="flex animate-pulse flex-col items-center gap-4 md:flex-row md:items-end md:justify-between">
        {/* Skeleton for the heading - now in two lines */}
        <div className="flex w-full max-w-[650px] flex-col gap-2">
          <div className="h-[52px] w-full rounded bg-gray-100/50 md:h-[72px]" />
          <div className="h-[52px] w-3/4 rounded bg-gray-100/50 md:h-[72px]" />
        </div>

        {/* Skeleton for the phase badge */}
        <div className="flex w-full justify-start md:w-1/4 md:justify-end">
          <div className="mt-2 h-[32px] w-[100px] rounded-full bg-gray-100/50" />
        </div>
      </div>
    </div>
  );
}

export default PresaleBannerSkeleton;
