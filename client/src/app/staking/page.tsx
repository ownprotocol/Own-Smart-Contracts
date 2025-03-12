"use client";

import {
  StakeOwnTokenBanner,
  EarnAPYTimer,
  MainNavigation,
  ConnectWalletButton,
} from "@/components";
import { useState } from "react";

import StakingDrawerContent from "@/components/staking/staking-drawer-content";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useGetAuthUser } from "@/query";

function StakingPage() {
  const [isOpen, setIsOpen] = useState(false);

  const { isValid } = useGetAuthUser();

  return (
    <main className="min-h-screen px-[5%] pt-4 md:px-[10%] md:pt-8">
      <div className="relative flex flex-col">
        <StakeOwnTokenBanner />
        <EarnAPYTimer />
        <div className="mt-2 flex flex-col gap-3 p-4 sm:flex-row md:justify-center md:gap-4">
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              {isValid && (
                <Button className="font-funnel bg-[#C58BFF] px-8 py-6 text-[14px] font-medium leading-[14px] tracking-[0%] text-black hover:bg-[#E49048] md:text-[16px] md:leading-[16px]">
                  Stake $Own
                </Button>
              )}
            </DrawerTrigger>
            <DrawerContent className="h-[90vh] max-h-[90vh] px-[5%] md:px-[10%] xl:h-[90vh] xl:max-h-[90vh]">
              <StakingDrawerContent />
            </DrawerContent>
          </Drawer>
        </div>
        {!isValid && (
          <div className="mx-auto w-full max-w-[200px]">
            <ConnectWalletButton />
          </div>
        )}
        <MainNavigation />
      </div>
    </main>
  );
}

export default StakingPage;
