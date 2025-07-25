"use client";

import Image from "next/image";
import { DrawerHeader, DrawerClose } from "../ui/drawer";
import { Button } from "../ui/button";
import { displayedEthAmount } from "@/lib/display";

interface StakingConfirmationProps {
  tokensToStake: number;
  lockupDuration: number;
  setIsOpen: (isOpen: boolean) => void;
}

const StakingConfirmation = ({
  tokensToStake,
  lockupDuration,
  setIsOpen,
}: StakingConfirmationProps) => {
  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-4 py-12 text-center md:py-0">
      <DrawerHeader className="relative w-full">
        <DrawerClose className="absolute right-0 top-0">
          <span className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Close
          </span>
        </DrawerClose>
      </DrawerHeader>
      <div className="relative mb-8 max-w-[250px]">
        <Image
          src="/staking-confirmation.png"
          alt="Staking confirmed"
          width={200}
          height={200}
        />
      </div>

      <div>
        <h2 className="align-middle font-dm_sans text-[14px] font-normal leading-[14px] tracking-[0%] text-gray-500 text-primary md:text-[20px] md:leading-[16px]">
          Confirmed
        </h2>
        <div className="flex items-center justify-center gap-2 pt-8 text-primary">
          <div className="h-10 w-10 rounded-full border-2 border-gray-500 px-1 py-3.5 text-gray-500 opacity-50">
            <Image
              src="/own-logo.svg"
              alt="Own token"
              width={30}
              height={30}
              className="text-primary invert"
            />
          </div>
          <span className="font-dm_sans text-[32px] font-normal leading-[32px] tracking-[0.5%] md:text-[48px] md:leading-[48px]">
            {displayedEthAmount(tokensToStake)}
          </span>
        </div>
        <p className="pt-4 align-middle font-dm_mono text-[12px] uppercase leading-[100%] tracking-[8%] text-gray-500 md:text-[14px]">
          LOCKED TILL{" "}
          {new Date(Date.now() + lockupDuration * 24 * 60 * 60 * 1000)
            .toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "/")}
        </p>

        {/* Button at the end */}
        <div className="mt-8">
          <Button
            onClick={() => setIsOpen(false)}
            className="min-w-[200px] rounded-md border border-gray-300 bg-white px-4 py-2 font-dm_sans text-sm font-medium text-gray-500 hover:bg-primary/90"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StakingConfirmation;

