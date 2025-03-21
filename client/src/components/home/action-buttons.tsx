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

interface ActionButtonsProps {
  ownBalance: number;
  usdtBalance: number;
  ownPrice: number;
  refetch: () => Promise<void>;
}

function ActionButtons({
  ownBalance,
  usdtBalance,
  ownPrice,
  refetch,
}: ActionButtonsProps) {
  const [buyWithCryptoOpen, setBuyWithCryptoOpen] = useState(false);

  const cryptoButtonStyles =
    "font-funnel bg-black px-8 py-6 text-[14px] leading-[14px] tracking-[0%] text-white hover:bg-gray-900 md:text-[16px] md:leading-[16px]";

  return (
    <div className="mt-4 flex flex-col gap-3 p-4 md:flex-row md:justify-center md:gap-4">
      {/* Card payment button */}
      <Button
        variant="mainButton"
        onClick={() => {
          console.log("Credit card payment clicked");
          openWertWidget();
        }}
      >
        Buy with Card
      </Button>

      <Drawer open={buyWithCryptoOpen} onOpenChange={setBuyWithCryptoOpen}>
        <DrawerTrigger asChild>
          <Button className={cryptoButtonStyles}>Buy with Crypto</Button>
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
                <div className="font-funnel w-full text-[24px] leading-[28px] tracking-[-5%] text-black lg:text-[32px] lg:leading-[38px] lg:tracking-[-5%] xl:text-[42px] xl:leading-[48px]">
                  Buy with Crypto
                </div>
              </div>
            </DrawerTitle>
          </DrawerHeader>
          <BuyWithCryptoDrawer
            setIsOpen={setBuyWithCryptoOpen}
            usdtBalance={usdtBalance}
            ownBalance={ownBalance}
            ownPrice={ownPrice}
            refetch={refetch}
          />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default ActionButtons;
