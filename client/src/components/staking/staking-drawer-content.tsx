"use client";

import StakingDrawerHeader from "./staking-drawer-header";
import Staking from "./staking";

const StakingDrawerContent = () => {
  return (
    <div className="mx-auto w-full px-[0%] pt-0 md:px-[5%] md:pt-8">
      <StakingDrawerHeader />
      <Staking />
    </div>
  );
};

export default StakingDrawerContent;
