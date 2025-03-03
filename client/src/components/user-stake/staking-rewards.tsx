"use client";

import Image from "next/image";
import { Button } from "../ui/button";

interface RewardBoxProps {
  label: string;
  value: string | number;
  isClaimable?: boolean;
  showLogo?: boolean;
  onClaim?: () => void;
}

function RewardBox({ label, value, isClaimable, onClaim, showLogo }: RewardBoxProps) {
  return (
    <div className="flex flex-col items-center space-y-2 md:space-y-0 md:items-start">
      <span className="w-full text-left uppercase text-gray-400 font-dm_mono text-[12px] leading-[12px] tracking-[8%] md:text-[14px] md:leading-[14px]">
        {label}
      </span>
      <div className="flex w-full items-center gap-2 pt-4 ">
        {showLogo && (
          <Image
            src="/own-logo.svg"
            alt="OWN"
            width={24}
            height={24}
            className="rounded-full"
          />
        )}
        <span className={`font-dm_sans text-right text-[22px] leading-[22px] tracking-[2%] font-[500] text-white md:text-[32px] md:leading-[32px] ${showLogo ? "px-4 md:px-12" : ""}`}>
          {value}
        </span>
        {isClaimable && (
          <Button
            variant="secondary"
            onClick={onClaim}
            className=" pl-8 rounded-md bg-[#9333EA] px-4 py-1 text-sm text-white transition-colors hover:bg-[#7E22CE]"
          >
            Claim
          </Button>
        )}
      </div>
    </div>
  );
}

 function StakingRewards() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-8 rounded-xl bg-[#111111] md:grid-cols-3 md:gap-12">
      <RewardBox label="$OWN Received" value="10,000" />
      <RewardBox label="Rewards Earned" value="100" />
      <RewardBox
        label="Claimable Rewards"
        value="50"
        isClaimable
        showLogo
        onClaim={() => {
          console.log("Claiming rewards");
          //TODO: Implement claim logic here
        }}
      />
    </div>
  );
}

export default StakingRewards;