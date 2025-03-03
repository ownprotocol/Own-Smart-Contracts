// "use client";
import {
  ActionButtons,
  MainNavigation,
  PresaleBanner,
  PriceIncreaseTimer,
  RaiseStats,
  TokenomicsChart,
  TokenomicsChartMobile,
} from "@/components";
// import { useState, useEffect } from "react";
// import Loading from "./loading";
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function HomePage() {
  const hasPresaleConcluded = false;
  await wait(2000);

  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   setIsLoading(true);
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // }, []);
  // useEffect(() => {
  //   const loadData = async () => {
  //     setIsLoading(true);
  //     // Simulate API call or data loading
  //     await wait(2000);
  //     setIsLoading(false);
  //   };

  //   loadData().catch(console.error);
  // }, []);

  // if (isLoading) {
  //   return <Loading />;
  // }

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
