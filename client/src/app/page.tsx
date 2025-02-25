import {
  ActionButtons,
  MainNavigation,
  PresaleBanner,
  PriceIncreaseTimer,
  RaiseStats,
  TokenomicsChart,
  TokenomicsChartMobile,
} from "@/components";

export default function HomePage() {
  return (
    <main className="mx-[10%] mt-[10%] min-h-screen md:mt-[3%]">
      <div className="relative flex flex-col">
        <PresaleBanner />
        <RaiseStats />
        <PriceIncreaseTimer />
        <ActionButtons />
        <TokenomicsChart />
        <TokenomicsChartMobile />
        <MainNavigation />
      </div>
    </main>
  );
}
