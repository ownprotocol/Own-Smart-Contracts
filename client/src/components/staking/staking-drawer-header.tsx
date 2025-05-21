import React from "react";
import Image from "next/image";

interface StakingDrawerHeaderProps {
  ownBalance: number;
}

function StakingDrawerHeader({ ownBalance }: StakingDrawerHeaderProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-1 md:flex-row md:gap-4">
      <div className="header flex-1 text-black">Stake tokens</div>
      <div className="flex w-full flex-1 items-end justify-center gap-2 md:justify-start">
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
          {ownBalance.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default StakingDrawerHeader;
