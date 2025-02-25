import {
  ActionButtons,
  PresaleBanner,
  PriceIncreaseTimer,
  RaiseStats,
  TokenomicsChart,
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
      </div>
    </main>
  );
}
