import {
    ActionButtonsSkeleton,
    MainNavigationSkeleton,
    PresaleBannerSkeleton,
    PriceIncreaseTimerSkeleton,
    RaiseStatsSkeleton,
    TokenomicsChartSkeleton,
    TokenomicsChartMobileSkeleton,
  } from "@/components";
  
  function Loading() {
    return (
      <main className="px-[5%] md:px-[10%] pt-[10%] min-h-screen md:pt-[3%]">
        <div className="relative flex flex-col">
          <PresaleBannerSkeleton />
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