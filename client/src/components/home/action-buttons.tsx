"use client";
import { Button } from "@/components/ui/button";
import { openWertWidget } from "@/config/wert-config";
import { useState } from "react";
import { ConnectWalletButton } from "@/components";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { BuyWithCryptoDrawer } from "./buy-with-crypto/buy-with-crypto-modal";
import { useActiveAccount } from "thirdweb/react";

function ActionButtons() {
  const account = useActiveAccount();
  const [buyWithCryptoOpen, setBuyWithCryptoOpen] = useState(false);

  const buttonStyles =
    "font-funnel bg-[#C58BFF] px-8 py-6 text-[14px] font-medium leading-[14px] tracking-[0%] text-black hover:bg-[#E49048] md:text-[16px] md:leading-[16px]";
  const cryptoButtonStyles =
    "font-funnel bg-black px-8 py-6 text-[14px] leading-[14px] tracking-[0%] text-white hover:bg-gray-900 md:text-[16px] md:leading-[16px]";

  return (
    <div className="mt-4 flex flex-col gap-3 p-4 md:flex-row md:justify-center md:gap-4">
      {/* Card payment button */}
      {account && (
        <Button
          className={buttonStyles}
          onClick={() => {
            console.log("Credit card payment clicked");
            openWertWidget();
          }}
        >
          Buy with Card
        </Button>
      )}

      {account && (
        <Drawer open={buyWithCryptoOpen} onOpenChange={setBuyWithCryptoOpen}>
          <DrawerTrigger asChild>
            <Button className={cryptoButtonStyles}>Buy with Crypto</Button>
          </DrawerTrigger>
          <DrawerContent className="h-[90vh] max-h-[90vh] px-[5%] md:px-[10%] xl:h-[90vh] xl:max-h-[90vh]">
            <BuyWithCryptoDrawer
              setIsOpen={setBuyWithCryptoOpen}
              usdtBalance={0}
            />
          </DrawerContent>
        </Drawer>
      )}

      {!account && (
        <ConnectWalletButton
          bgColor="black"
          textColor="white"
          isHoverable={false}
          className="!font-funnel !cursor-pointer !font-semibold"
        />
      )}
    </div>
  );
}

export default ActionButtons;
