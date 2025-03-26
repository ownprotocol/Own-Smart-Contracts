"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface RewardBoxProps {
  label: string;
  value: string | number;
  isClaimable?: boolean;
  showLogo?: boolean;
  onClaim?: () => Promise<void>;
  disabled?: boolean;
}

function RewardBox({
  label,
  value,
  isClaimable,
  onClaim,
  showLogo,
  disabled,
}: RewardBoxProps) {
  return (
    <div className="flex flex-col items-center space-y-1 md:items-start md:space-y-0">
      <span className="w-full text-left font-dm_mono text-[12px] uppercase leading-[12px] tracking-[8%] text-gray-400 md:text-[14px] md:leading-[14px]">
        {label}
      </span>
      <div className="flex w-full items-center gap-2 pt-2 md:pt-4">
        {showLogo && (
          <Image
            src="/own-logo.svg"
            alt="OWN"
            width={24}
            height={24}
            className="rounded-full"
          />
        )}
        <span
          className={`text-right font-dm_sans text-[22px] font-[500] leading-[22px] tracking-[2%] text-white md:text-[32px] md:leading-[32px] ${showLogo ? "px-4 md:px-12" : ""}`}
        >
          {value}
        </span>
        {isClaimable && (
          <Button
            variant="secondary"
            onClick={onClaim}
            className={`rounded-md bg-[#9333EA] px-4 py-1 pl-8 text-sm text-white transition-colors hover:bg-[#7E22CE] ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={disabled}
            useSpinner
          >
            Claim
          </Button>
        )}
      </div>
    </div>
  );
}

export default RewardBox;
