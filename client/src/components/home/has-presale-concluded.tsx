"use client";

import { format } from "date-fns";

import { SquareDots } from "@/components";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";
import { TableHeader, TableRow } from "../table/table-common-components";
import { cn } from "@/lib/utils";

const rounds = [1, 2, 3, 4, 5, 6];
const rows = [
  {
    timestamp: new Date(),
    ownAmount: 100,
    usdtAmount: 100,
  },
];

function HasPresaleConcluded() {
  const [activeRound, setActiveRound] = useState(1);
  console.log("activeRound", activeRound);

  return (
    <div className="relative h-screen w-full">
      <SquareDots />
      <div className="container mx-auto max-w-[1000px]">
        <h1 className="font-funnel flex max-w-[750px] items-center px-8 pb-2 text-[32px] font-[400] leading-[42px] tracking-[-5%] md:px-0 md:pb-8 md:text-[72px] md:leading-[72px]">
          $Own Token Presale Concluded
        </h1>
        <p className="mt-4 min-h-[100px] px-8 font-['DM_Sans'] text-[20px] font-[400] leading-[32px] text-[#B4B4B4] md:min-h-[100px] md:px-0 md:text-[32px] md:leading-[42px]">
          Thanks for participating! You can claim your $Own after TGE and will
          be able to stake them to earn rewards.
        </p>

        <div className="px-8 pt-4 md:px-0">
          <div className="flex flex-col gap-4 md:flex-row md:gap-12">
            <div>
              <p className="pt-2 font-dm_mono text-[12px] font-[400] uppercase leading-[12px] tracking-[0.08em] text-[#B4B4B4] md:text-[14px] md:leading-[14px]">
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
              <p className="pt-2 font-dm_mono text-[12px] font-[400] uppercase leading-[12px] tracking-[0.08em] text-[#B4B4B4] md:text-[14px] md:leading-[14px]">
                CONTRACT ADDRESS FOR $OWN
              </p>
              <p className="font-dm_mono text-[20px] font-[400] text-white md:text-[32px]">
                0X23EF85AC3C3D34324532
              </p>
            </div>
          </div>
          <div className="mt-8 sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="font-dm_mono text-[14px] font-[400] text-white md:text-[16px]">
                Your Presale Purchases
              </h1>
              <div className="flex flex-wrap gap-2 pt-4 text-xs md:flex-row md:flex-wrap md:gap-2 md:text-base">
                {rounds.map((round) => (
                  <button
                    type="button"
                    key={round}
                    className={cn(
                      "cursor-pointer rounded-full px-4 py-1 text-white",
                      activeRound === round
                        ? "bg-orange-500 cursor-pointer"
                        : "bg-[#C1691180] text-[#F1AF6E]",
                    )}
                    onClick={() => {
                      setActiveRound(round);
                      console.log("clicked");
                    }}
                  >
                    Round {round}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flow-root md:mt-8">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <TableHeader>DATE</TableHeader>
                      <TableHeader>OWN AMOUNT</TableHeader>
                      <TableHeader>USDT SPENT</TableHeader>
                      <TableHeader>PRICE</TableHeader>
                      <TableHeader>CLAIMABLE</TableHeader>
                    </tr>
                  </thead>
                  {rows.length === 0 ? (
                    <tbody className="divide-y divide-gray-800 font-dm_mono">
                      <tr>
                        <td colSpan={4} className="py-12 text-center">
                          No presale purchases found
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody className="divide-y divide-gray-800 font-dm_mono">
                      {rows.map((presalePurchase) => (
                        <tr key={presalePurchase.timestamp.toString()}>
                          <TableRow>
                            {format(
                              presalePurchase.timestamp,
                              "hh:mm dd/MM/yyyy",
                            )}
                          </TableRow>
                          <TableRow>
                            {presalePurchase.ownAmount.toFixed(2)}
                          </TableRow>
                          <TableRow>
                            ${presalePurchase.usdtAmount.toFixed(2)}
                          </TableRow>
                          <TableRow>$100</TableRow>
                          <TableRow>something</TableRow>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 py-4 sm:flex-row md:justify-start md:gap-4">
            <Button
              className="font-funnel bg-[#C58BFF] px-8 py-6 text-[14px] font-medium leading-[14px] tracking-[0%] text-black hover:bg-[#E49048] md:text-[16px] md:leading-[16px]"
              onClick={() => {
                console.log("CLAIM NOW");
              }}
            >
              Claim Now
            </Button>

            <Button
              className="font-funnel bg-black px-8 py-6 text-[14px] leading-[14px] tracking-[0%] text-white hover:bg-gray-900 md:text-[16px] md:leading-[16px]"
              onClick={() => {
                console.log("Buy more in MEXC");
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
