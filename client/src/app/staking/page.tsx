"use client";

import {
  StakeOwnTokenBanner,
  EarnAPYTimer,
  MainNavigation,
} from "@/components";
import StakingDrawerContent from "@/components/staking/staking-drawer-content";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useState } from "react";

function StakingPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main className="min-h-screen px-[5%] pt-4 md:px-[10%] md:pt-8">
      <div className="relative flex flex-col">
        <StakeOwnTokenBanner />
        <EarnAPYTimer />
        <div className="mt-2 flex flex-col gap-3 p-4 sm:flex-row md:justify-center md:gap-4">
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <Button
                className="font-funnel bg-[#C58BFF] px-8 py-6 text-[14px] font-medium leading-[14px] tracking-[0%] text-black hover:bg-[#E49048] md:text-[16px] md:leading-[16px]"
                onClick={() => {
                  console.log("Stake $Own clicked");
                }}
              >
                Stake $Own
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[90vh] max-h-[90vh] px-[5%] xl:h-[90vh] xl:max-h-[90vh] md:px-[10%]">
              <StakingDrawerContent />
            </DrawerContent>
          </Drawer>
        </div>
        <MainNavigation isLoading={false} />
      </div>
    </main>
  );
}

export default StakingPage;
