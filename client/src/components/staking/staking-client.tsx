"use client";

import { StakingPageContent } from "@/components/staking/staking-page-content";

function StakingPageClient() {
  return (
    <main className="flex flex-col gap-4">
      <div className="mx-auto flex w-full flex-col items-center justify-center">
        <h1 className="font-funnel flex text-center text-[32px] font-[400] leading-[36px] tracking-[-5%] md:text-[72px] md:leading-[72px]">
          Stake $Own Token
        </h1>
      </div>
      <StakingPageContent />
    </main>
  );
}

export default StakingPageClient;
