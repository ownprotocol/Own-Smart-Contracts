import {
  ActionButtonsSkeleton,
  MainNavigationSkeleton,
  PriceIncreaseTimerSkeleton,
  RaiseStatsSkeleton,
  TokenomicsChartSkeleton,
  TokenomicsChartMobileSkeleton,
  PresaleBanner,
} from "@/components";

function Loading() {
  return (
    <main className="min-h-screen px-[5%] pt-[10%] md:px-[10%] md:pt-[3%]">
      <div className="relative flex flex-col">
        <PresaleBanner roundId={null} />
        <RaiseStatsSkeleton />
        <PriceIncreaseTimerSkeleton />
        <ActionButtonsSkeleton />
        <TokenomicsChartSkeleton />
        <TokenomicsChartMobileSkeleton />
        <MainNavigationSkeleton />
      </div>
    </main>
  );
}

export default Loading;

