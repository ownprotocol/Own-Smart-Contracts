import React from "react";
import { DrawerTitle } from "../ui/drawer";
import { DrawerClose } from "../ui/drawer";
import { DrawerHeader } from "../ui/drawer";
import Image from "next/image";

function StakingDrawerHeader() {
  return (
    <DrawerHeader className="relative">
      <DrawerClose className="absolute right-0 top-0">
        <span className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
          Close
        </span>
      </DrawerClose>
      <DrawerTitle className="text-black">
        <div className="flex w-full flex-col justify-center gap-1 md:flex-row md:gap-4">
          <div className="font-funnel w-full text-[24px] leading-[28px] tracking-[-5%] text-black lg:text-[32px] lg:leading-[38px] lg:tracking-[-5%] xl:text-[42px] xl:leading-[48px]">
            Stake tokens
          </div>
          <div className="flex w-full items-end justify-center gap-2 md:justify-start">
            <h1 className="font-dm_mono text-[12px] font-[400] leading-[14px] tracking-[8%] text-gray-500 md:text-[14px] md:leading-[16px]">
              BALANCE
            </h1>
            <Image
              src="/home-page/hero/subtract.png"
              alt="Subtract icon"
              width={15}
              height={15}
            />
            <p className="font-dm_mono text-[12px] font-[400] leading-[14px] tracking-[8%] text-black md:text-[14px] md:leading-[16px]">
              30,000
            </p>
          </div>
        </div>
      </DrawerTitle>
    </DrawerHeader>
  );
}

export default StakingDrawerHeader;
