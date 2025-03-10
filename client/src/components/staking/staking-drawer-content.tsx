"use client";

import StakingDrawerHeader from "./staking-drawer-header";
import StakingForm from "./staking-form";

const StakingDrawerContent = () => {
  return (
    <div className="mx-auto w-full px-[0%] pt-0 md:px-[5%] md:pt-8">
      <StakingDrawerHeader />
      <StakingForm />
    </div>
  );
};

export default StakingDrawerContent;
