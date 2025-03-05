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
            <PresaleBanner isLoading={false} />
            <RaiseStats isLoading={false} />
            <PriceIncreaseTimer isLoading={false} />
            <ActionButtons isLoading={false} />
          </>
        )}
        <TokenomicsChart isLoading={false} />
        <TokenomicsChartMobile isLoading={false} />
        <MainNavigation isLoading={false} />
      </div>
    </main>
  );
}
