"use client";
import { Button } from "@/components/ui/button";
import { openWertWidget } from "@/config/wert-config";
import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { BuyWithCryptoDrawer } from "./buy-with-crypto/buy-with-crypto-modal";
import { type CurrentPresaleRoundDetails } from "@/types/presale";

interface ActionButtonsProps {
  ownBalance: number;
  usdtBalance: number;
  ownPrice: number;
  refetch: () => Promise<void>;
  authUserIsValid: boolean;
  presaleAllocation: CurrentPresaleRoundDetails["roundDetails"]["allocation"];
  preSaleSold: CurrentPresaleRoundDetails["roundDetails"]["sales"];
}

function ActionButtons({
  ownBalance,
  usdtBalance,
  ownPrice,
  refetch,
  authUserIsValid,
  presaleAllocation,
  preSaleSold,
}: ActionButtonsProps) {
  const [buyWithCryptoOpen, setBuyWithCryptoOpen] = useState(false);
  const maxAllocation = presaleAllocation - preSaleSold;
  const cryptoButtonStyles =
    "font-funnel bg-black px-8 py-6 text-[14px] leading-[14px] tracking-[0%] text-white hover:bg-gray-900 md:text-[16px] md:leading-[16px]";

  return (
    <div className="mt-4 flex flex-col gap-3 p-4 md:flex-row md:justify-center md:gap-4">
      {/* Card payment button */}
      <Button
        disabled={!authUserIsValid}
        variant="mainButton"
        onClick={() => {
          if (authUserIsValid) {
            openWertWidget();
          }
        }}
      >
        Buy with Card
      </Button>

      <Drawer open={buyWithCryptoOpen} onOpenChange={setBuyWithCryptoOpen}>
        <DrawerTrigger asChild>
          <Button disabled={!authUserIsValid} className={cryptoButtonStyles}>
            Buy with Crypto
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[90vh] max-h-[90vh] px-[5%] md:px-[10%] xl:h-[90vh] xl:max-h-[90vh]">
          <DrawerHeader className="relative">
            <DrawerClose className="absolute right-0 top-0">
              <span className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Close
              </span>
            </DrawerClose>
            <DrawerTitle className="text-black">
              <div className="flex w-full flex-col justify-center gap-1 md:flex-row md:gap-4">
                <span className="font-funnel text-[32px] leading-[40px] tracking-[-0.05em] md:text-[64px] md:leading-[72px]">
                  Buy with Cryptos
                </span>
              </div>
            </DrawerTitle>
          </DrawerHeader>
          <BuyWithCryptoDrawer
            setIsOpen={setBuyWithCryptoOpen}
            usdtBalance={usdtBalance}
            ownBalance={ownBalance}
            ownPrice={ownPrice}
            refetch={refetch}
            maxAllocation={maxAllocation}
          />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default ActionButtons;
