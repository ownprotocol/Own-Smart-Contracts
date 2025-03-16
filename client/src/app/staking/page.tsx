"use client";

import {
  StakeOwnTokenBanner,
  EarnAPYTimer,
  MainNavigation,
  ConnectWalletButton,
} from "@/components";
import { startTransition, useActionState, useEffect, useState } from "react";

import StakingDrawerContent from "@/components/staking/staking-drawer-content";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useGetAuthUser } from "@/query";

function StakingPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [authCheck, setAuthCheck] = useState(false);

  const { isPending, isValid } = useGetAuthUser();
  useEffect(() => {
    if (!isPending) {
      setAuthCheck(true);
    }
  }, [isPending]);

  console.log("isPending outside useEffect", isPending);
  console.log("authStatus outside useEffect", isValid);
  const buttonStyles =
    "font-funnel hover:bg-[#D58BFF] !mx-auto !w-full !max-w-fit !bg-[#C58BFF] !px-8 !py-6 !text-[14px] !font-medium !leading-[14px] !tracking-[0%] !text-black !md:text-[16px] !md:leading-[16px]";

  return (
    <main className="min-h-screen px-[5%] pt-4 md:px-[10%] md:pt-8">
      <div className="relative flex flex-col">
        <StakeOwnTokenBanner />
        <EarnAPYTimer />
        <div className="mt-2 flex flex-col gap-3 p-4 sm:flex-row sm:justify-center sm:gap-4">
          {isValid && authCheck && (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerTrigger asChild>
                <Button className={buttonStyles}>Stake $Own</Button>
              </DrawerTrigger>
              <DrawerContent className="h-[90vh] max-h-[90vh] px-[5%] md:px-[10%] xl:h-[90vh] xl:max-h-[90vh]">
                <StakingDrawerContent setIsOpen={setIsOpen} />
              </DrawerContent>
            </Drawer>
          )}
          {(!authCheck || isPending) && (
            <Button className={buttonStyles} disabled>
              Loading...
            </Button>
          )}
          {!isValid && authCheck && !isPending && (
            <ConnectWalletButton
              title="Stake $Own"
              bgColor="#C58BFF"
              textColor="black"
              isHoverable={false}
              className={
                "!md:text-[20px] !md:leading-[20px] !cursor-pointer !font-fun !font-semibold"
              }
            />
          )}
        </div>

        <MainNavigation />
      </div>
    </main>
  );
}

export default StakingPage;
