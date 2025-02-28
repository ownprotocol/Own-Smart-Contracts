"use client";

import {
  ActionButtons,
  MainNavigation,
  PresaleBanner,
  PriceIncreaseTimer,
  RaiseStats,
  TokenomicsChart,
  TokenomicsChartMobile,
} from "@/components";
import { useState, useEffect } from "react";

export default function HomePage() {
  const hasPresaleConcluded = false;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="px-[5%] md:px-[10%] pt-[10%] min-h-screen md:pt-[3%]">
      <div className="relative flex flex-col">
        {!hasPresaleConcluded && (
          <>
            <PresaleBanner isLoading={isLoading} />
            <RaiseStats isLoading={isLoading} />
            <PriceIncreaseTimer isLoading={isLoading} />
            <ActionButtons isLoading={isLoading} />
          </>
        )}
        <TokenomicsChart isLoading={isLoading} />
        <TokenomicsChartMobile isLoading={isLoading} />
        <MainNavigation  isLoading={isLoading}/>
      </div>
    </main>
  );
}
