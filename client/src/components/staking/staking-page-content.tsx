"use client";

import {
  StakeOwnTokenBanner,
  EarnAPYTimer,
  MainNavigation,
  ConnectWalletButton,
} from "@/components";
import StakingDrawerContent from "@/components/staking/staking-drawer-content";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useStakingPage } from "@/hooks/use-staking-page";
import { useActiveAccount } from "thirdweb/react";
import { useState } from "react";

const buttonStyles =
  "font-funnel hover:bg-[#D58BFF] !mx-auto !w-full !max-w-fit !bg-[#C58BFF] !px-8 !py-6 !text-[14px] !font-medium !leading-[14px] !tracking-[0%] !text-black !md:text-[16px] !md:leading-[16px]";

export const StakingPageContent = () => {
  const stakingPageHook = useStakingPage();
  const account = useActiveAccount();

  const [stakingDrawerOpen, setStakingDrawerOpen] = useState(false);

  if (!account) {
    return (
      <div className="flex items-center">
        <ConnectWalletButton title="Stake $Own" />
      </div>
    );
  }

  if (stakingPageHook.isLoading) {
    // TODO: Skeletons etc
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex flex-col">
      <StakeOwnTokenBanner percentage={stakingPageHook.data.boost} />
      <EarnAPYTimer percentage={stakingPageHook.data.boost} />
      <div className="mt-2 flex flex-col gap-3 p-4 sm:flex-row sm:justify-center sm:gap-4">
        <Drawer open={stakingDrawerOpen} onOpenChange={setStakingDrawerOpen}>
          <DrawerTrigger asChild>
            <Button className={buttonStyles}>Stake $Own</Button>
          </DrawerTrigger>
          <DrawerContent className="h-[90vh] max-h-[90vh] px-[5%] md:px-[10%] xl:h-[90vh] xl:max-h-[90vh]">
            <StakingDrawerContent setIsOpen={setStakingDrawerOpen} />
          </DrawerContent>
        </Drawer>
        {!account && (
          <ConnectWalletButton
            title="Stake $Own"
            bgColor="#C58BFF"
            textColor="black"
            isHoverable={false}
            className={
              "!md:text-[20px] !md:leading-[20px] !font-funnel !cursor-pointer !font-semibold"
            }
          />
        )}
      </div>
    </div>
  );
};
