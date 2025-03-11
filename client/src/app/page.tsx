import { isLoggedIn } from "@/actions/login";
import {
  ActionButtons,
  MainNavigation,
  PresaleBanner,
  PriceIncreaseTimer,
  RaiseStats,
  TokenomicsChart,
  TokenomicsChartMobile,
} from "@/components";

export default async function HomePage() {
  const hasPresaleConcluded = false;
  await isLoggedIn();
  return (
    <main className="min-h-screen px-[5%] pt-[10%] md:px-[10%] md:pt-[3%]">
      <div className="relative flex flex-col">
        {!hasPresaleConcluded && (
          <>
            <PresaleBanner />
            <RaiseStats />
            <PriceIncreaseTimer />
            <ActionButtons />
          </>
        )}
        <TokenomicsChart />
        <TokenomicsChartMobile />
        <MainNavigation />
      </div>
    </main>
  );
}
