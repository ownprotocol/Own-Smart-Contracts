"use client";
import { PillarBackgrounds, SquareDots } from "@/components";
import Image from "next/image";
import { Button } from "../ui/button";

function HasPresaleConcluded() {
  return (
    <div className="relative h-screen w-full">
      <PillarBackgrounds />
      <SquareDots />
      <div className="container mx-auto max-w-[1000px]">
        <h1 className="font-funnel mt-[10%] flex max-w-[750px] items-center gap-3 px-8 text-[52px] font-[400] leading-[52px] tracking-[-5%] md:px-0 md:text-[72px] md:leading-[72px]">
          $Own Token Presale Concluded
        </h1>
        <p className="mt-4 px-8 font-['DM_Sans'] text-[20px] font-[400] leading-[32px] text-[#B4B4B4] md:px-0 md:text-[32px] md:leading-[42px]">
          Thanks for participating! You can claim your $Own after TGE and will
          be able to stake them to earn rewards.
        </p>

        <div className="px-8 pt-12 md:px-0">
          <div className="flex flex-col gap-4 md:flex-row md:gap-12">
            <div>
              <p className="pt-4 font-dm_mono text-[12px] font-[400] uppercase leading-[12px] tracking-[0.08em] text-[#B4B4B4] md:text-[14px] md:leading-[14px]">
                YOUR $OWN
              </p>
              <div className="flex items-center gap-2">
                <Image
                  src="/home-page/hero/subtract.png"
                  alt="Subtract icon"
                  width={20}
                  height={20}
                />
                <p className="font-dm_mono text-[24px] font-[400] text-white md:text-[32px]">
                  30,000
                </p>
              </div>
            </div>

            <div>
              <p className="pt-4 font-dm_mono text-[12px] font-[400] uppercase leading-[12px] tracking-[0.08em] text-[#B4B4B4] md:text-[14px] md:leading-[14px]">
                CONTRACT ADDRESS FOR $OWN
              </p>
              <p className="font-dm_mono text-[24px] font-[400] text-white md:text-[32px]">
                0X23EF85AC3C3D34324532
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 py-4 sm:flex-row md:justify-start md:gap-4">
            <Button
              className="font-funnel bg-[#C58BFF] px-8 py-6 text-[14px] font-medium leading-[14px] tracking-[0%] text-black hover:bg-[#E49048] md:text-[16px] md:leading-[16px]"
              onClick={() => {
                // Handle credit card payment
                console.log("Credit card payment clicked");
              }}
            >
              Claim Now
            </Button>

            <Button
              className="font-funnel bg-black px-8 py-6 text-[14px] leading-[14px] tracking-[0%] text-white hover:bg-gray-900 md:text-[16px] md:leading-[16px]"
              onClick={() => {
                // Handle crypto payment
                console.log("Crypto payment clicked");
              }}
            >
              Buy more in MEXC
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HasPresaleConcluded;
