import Image from "next/image";
import { Button } from "../ui/button";
import {
  DrawerHeader,
  DrawerDescription,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "../ui/drawer";

const StakingDrawerContent = () => {
  return (
    <div className="mx-auto w-full px-[5%] pt-4 md:px-[5%] md:pt-8">
      <DrawerHeader className="relative">
        <DrawerClose className="absolute right-0 top-0">
          <span className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Close
          </span>
        </DrawerClose>
        <DrawerTitle className="text-black">
          <div className="flex w-full justify-center gap-4">
            <div className="font-funnel w-full text-[42px] leading-[48px] tracking-[-5%] text-black md:text-[64px] md:leading-[72px]">
              Stake tokens
            </div>
            <div className="flex w-full items-end justify-start gap-2">
              <h1 className="font-dm_mono text-[12px] font-[400] leading-[14px] tracking-[8%] text-gray-500 md:text-[14px] md:leading-[16px]">
                BALANCE
              </h1>
              <Image
                src="/home-page/hero/subtract.png"
                alt="Subtract icon"
                width={20}
                height={20}
              />
              <p className="font-dm_mono text-[12px] font-[400] leading-[14px] tracking-[8%] text-black md:text-[14px] md:leading-[16px]">
                30,000
              </p>
            </div>
          </div>
        </DrawerTitle>
      </DrawerHeader>
      <div className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <div className="flex w-full flex-col gap-2">
              {/* <h1 className="font-dm_mono text-[12px] font-[400] leading-[14px] tracking-[8%] text-gray-500 md:text-[14px] md:leading-[16px]">
                Enter TOKENS TO STAKE
              </h1>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0"
                  className="w-full rounded border-2 border-gray-500/50 p-2 pl-14 text-primary"
                />
                <Image
                  src="/own-log0.svg"
                  alt="Own token"
                  width={20}
                  height={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                />
              </div> */}
              <h1 className="font-dm_mono text-[12px] font-[400] leading-[14px] tracking-[8%] text-gray-500 md:text-[14px] md:leading-[16px]">
                Enter TOKENS TO STAKE
              </h1>
              <div className="flex items-center border-2 border-gray-500/50 bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">
                  <div className="rounded-full border-2 border-black px-2 py-4">
                    <Image
                      src="/own-logo.svg"
                      alt="Own token"
                      width={25}
                      height={25}
                      className="text-primary invert"
                    />
                  </div>
                </div>
                <input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  className="block w-full min-w-0 grow py-6 pl-4 pr-3 font-dm_sans text-[16px] leading-[20px] tracking-[0.5%] text-gray-900 text-primary placeholder:text-gray-400 focus:outline-none md:text-[20px] md:leading-[24px]"
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <h1 className="font-dm_mono text-[12px] font-[400] leading-[14px] tracking-[8%] text-gray-500 md:text-[14px] md:leading-[16px]">
                Enter TOKENS TO STAKE
              </h1>
              <div className="flex items-center border-2 border-gray-500/50 bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <input
                  type="number"
                  placeholder="0"
                  className="block w-full min-w-0 grow py-6 pl-4 pr-3 font-dm_sans text-[16px] leading-[20px] tracking-[0.5%] text-gray-900 text-primary placeholder:text-gray-400 focus:outline-none md:text-[20px] md:leading-[24px]"
                />
              </div>
            </div>
          </div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        {/* Add your staking form content here */}
        <p>Staking form will go here</p>
      </div>
      <DrawerFooter>
        <Button>Confirm Stake</Button>
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </div>
  );
};

export default StakingDrawerContent;
