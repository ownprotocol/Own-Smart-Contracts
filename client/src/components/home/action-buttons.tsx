"use client";
import { Button } from "@/components/ui/button";
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
import { useActiveAccount } from "thirdweb/react";
import WertWidget from "@wert-io/widget-initializer";
import { useActiveChainWithDefault } from "@/hooks/useChainWithDefault";
import axios from "axios";
import { signSmartContractData } from "@wert-io/widget-sc-signer";
import { buildWertOptions } from "@/config/wert-config";

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
  const account = useActiveAccount();
  const chain = useActiveChainWithDefault();

  const cryptoButtonStyles =
    "font-funnel bg-black px-8 py-6 text-[14px] leading-[14px] tracking-[0%] text-white hover:bg-gray-900 md:text-[16px] md:leading-[16px]";

  const openWertWidgetHandler = async (amount: number) => {
    if (!account) return;

    const signedData = await axios.post<
      ReturnType<typeof signSmartContractData>
    >("/api/contracts/get-signed-presale-args", {
      amount,
      address: account.address,
      networkId: chain.id,
    });

    const wertWidget = new WertWidget({
      ...signedData.data,
      ...buildWertOptions(),
    });
    wertWidget.open();
  };

  return (
    <div className="mt-4 flex flex-col gap-3 p-4 md:flex-row md:justify-center md:gap-4">
      {/* Card payment button */}
      <Button
        disabled={!authUserIsValid}
        variant="mainButton"
        onClick={() => openWertWidgetHandler(1)}
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
