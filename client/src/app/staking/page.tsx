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

  const { isValid, isPending } = useGetAuthUser();

  return (
    <main className="min-h-screen px-[5%] pt-4 md:px-[10%] md:pt-8">
      <div className="relative flex flex-col">
        <StakeOwnTokenBanner />
        <EarnAPYTimer />
        <div className="mt-2 flex flex-col gap-3 p-4 sm:flex-row sm:justify-center sm:gap-4">
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
                {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- This is required for conditional rendering */}
                {(isValid || isPending) && (
                  <Button className="font-funnel mx-auto w-full max-w-fit bg-[#C58BFF] px-8 py-6 text-[14px] font-medium leading-[14px] tracking-[0%] text-black hover:bg-[#D58BFF]] md:text-[16px] md:leading-[16px]">
                    Stake $Own
                  </Button>
                )}
              </div>
            </DrawerTrigger>
            <DrawerContent className="h-[90vh] max-h-[90vh] px-[5%] md:px-[10%] xl:h-[90vh] xl:max-h-[90vh]">
              <StakingDrawerContent setIsOpen={setIsOpen} />
            </DrawerContent>
          </Drawer>
        </div>
        {!isValid && !isPending && (
          <div className="p- flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <ConnectWalletButton
              title="Stake $Own"
              bgColor="#C58BFF"
              textColor="black"
              isHoverable={false}
            />
          </div>
        )}
        <MainNavigation />
      </div>
    </main>
  );
}

export default StakingPage;
