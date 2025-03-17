"use client";
import WertWidget from "@wert-io/widget-initializer";
import type { Options } from "@wert-io/widget-initializer/types";

import { Button } from "@/components/ui/button";
import { activeChain } from "@/config/chain";

function ActionButtons() {
  // Define the options but don't initialize the widget yet
  const getWertOptions = (): Options => ({
    partner_id: "default",
    // click_id: uuidv4(), // unique id of purсhase in your system
    origin: "https://sandbox.wert.io", // this option needed only in sandbox
    commodity: "ETH",
    network: activeChain.name,
    commodities: JSON.stringify([
      {
        commodity: "POL",
        network: "amoy",
      },
      {
        commodity: "ETH",
        network: "sepolia",
      },
    ]),
    listeners: {
      loaded: () => console.log("loaded"),
    },
  });

  return (
    <div className="mt-4 flex flex-col gap-3 p-4 md:flex-row md:justify-center md:gap-4">
      <Button
        className="font-funnel bg-[#C58BFF] px-8 py-6 text-[14px] font-medium leading-[14px] tracking-[0%] text-black hover:bg-[#E49048] md:text-[16px] md:leading-[16px]"
        onClick={() => {
          // Initialize the widget only when the button is clicked
          const wertWidget = new WertWidget(getWertOptions());
          console.log("Credit card payment clicked");
          wertWidget.open();
        }}
      >
        Buy with Card
      </Button>

      <Button
        className="font-funnel bg-black px-8 py-6 text-[14px] leading-[14px] tracking-[0%] text-white hover:bg-gray-900 md:text-[16px] md:leading-[16px]"
        onClick={() => {
          // Handle crypto payment
          console.log("Crypto payment clicked");
        }}
      >
        Buy with Crypto
      </Button>
    </div>
  );
}

export default ActionButtons;
