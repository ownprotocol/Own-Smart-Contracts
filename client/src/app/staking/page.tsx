"use client";

import { StakeOwnTokenBanner, EarnAPYTimer, MainNavigation } from "@/components";
import { Button } from "@/components/ui/button";

function StakingPage() {
  return (
    <main className="px-[5%] pt-4 md:px-[10%] md:pt-8 min-h-screen">
      <div className="relative flex flex-col">
        <StakeOwnTokenBanner />
        <EarnAPYTimer />
        <div className="mt-2 flex flex-col gap-3 p-4 sm:flex-row md:justify-center md:gap-4">
          <Button
            className="font-funnel bg-[#C58BFF] px-8 py-6 text-[14px] font-medium leading-[14px] tracking-[0%] text-black hover:bg-[#E49048] md:text-[16px] md:leading-[16px]"
            onClick={() => {
              //stake
              console.log("Stake $Own clicked");
            }}
          >
            Stake $Own
          </Button>
        </div>
        <MainNavigation isLoading={false} />
      </div>
    </main>
  );
}

export default StakingPage;
