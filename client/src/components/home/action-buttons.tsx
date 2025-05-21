"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { BuyWithCryptoDrawer } from "./buy-with-crypto/buy-with-crypto-modal";
import { type CurrentPresaleRoundDetails } from "@/types/presale";
import { BuyWithCardDrawer } from "./buy-with-card/buy-with-card-modal";
import { CustomDrawer } from "../drawer";

interface ActionButtonsProps {
  ownBalance: number;
  usdtBalance: number;
  ownPrice: number;
  refetch: () => Promise<void>;
  presaleAllocation: CurrentPresaleRoundDetails["roundDetails"]["allocation"];
  preSaleSold: CurrentPresaleRoundDetails["roundDetails"]["sales"];
}

function ActionButtons({
  ownBalance,
  usdtBalance,
  ownPrice,
  refetch,
  presaleAllocation,
  preSaleSold,
}: ActionButtonsProps) {
  const [buyWithCryptoOpen, setBuyWithCryptoOpen] = useState(false);
  const [buyWithCardOpen, setBuyWithCardOpen] = useState(false);

  const maxAllocation = presaleAllocation - preSaleSold;

  const cryptoButtonStyles =
    "font-funnel bg-black px-8 py-6 text-[14px] leading-[14px] tracking-[0%] text-white hover:bg-gray-900 md:text-[16px] md:leading-[16px]";

  return (
    <div className="mt-4 flex flex-col gap-3 p-4 md:flex-row md:justify-center md:gap-4">
      {/* Card payment button */}

      <CustomDrawer
        button={<Button variant="mainButton">Buy with Card</Button>}
        title="Buy with Credit Card"
        isOpen={buyWithCardOpen}
        onOpenChange={setBuyWithCardOpen}
      >
        <BuyWithCardDrawer
          setIsOpen={setBuyWithCardOpen}
          usdtBalance={usdtBalance}
          ownBalance={ownBalance}
          ownPrice={ownPrice}
          refetch={refetch}
          maxAllocation={maxAllocation}
        />
      </CustomDrawer>
      <CustomDrawer
        button={<Button className={cryptoButtonStyles}>Buy with Crypto</Button>}
        title="Buy with Crypto"
        isOpen={buyWithCryptoOpen}
        onOpenChange={setBuyWithCryptoOpen}
      >
        <BuyWithCryptoDrawer
          setIsOpen={setBuyWithCryptoOpen}
          usdtBalance={usdtBalance}
          ownBalance={ownBalance}
          ownPrice={ownPrice}
          refetch={refetch}
          maxAllocation={maxAllocation}
        />
      </CustomDrawer>
    </div>
  );
}

export default ActionButtons;
