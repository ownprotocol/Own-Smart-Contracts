import type { Options } from "@wert-io/widget-initializer/types";
import { v4 as uuidv4 } from "uuid";
import WertWidget from "@wert-io/widget-initializer";
import { MAIN_CHAIN } from "./contracts";

/**
 * Return only the base options in production
 * Get Wert widget configuration options
 * @returns Wert widget options
 */
export const getWertOptions = (): Options => {
  // Base options that are always included
  const baseOptions: Partial<Options> = {
    partner_id: process.env.NEXT_PUBLIC_WERT_PARTNER_ID!,
    click_id: uuidv4(),
    commodity: "ETH",
    network: MAIN_CHAIN.name,
    commodities: JSON.stringify([
      {
        commodity: "ETH",
        network: "sepolia",
      },
      // Add $USDT token here when it's supported by Wert
      // {
      //   commodity: "$OWN",
      //   network: "ethereum",
      // },
    ]),

    // Optional: Theme customization
    // theme: "dark",

    // Optional: Color customization
    // color_background: "#1E1E1E",
    color_buttons: "#C58BFF",
    color_buttons_text: "#000000",

    listeners: {
      loaded: () => console.log("Wert widget loaded"),
      "payment-status": (data) => console.log("Payment status:", data),
      close: () => console.log("Widget closed"),
    },
  };
  if (process.env.NODE_ENV === "development") {
    return {
      ...baseOptions,
      origin: "https://sandbox.wert.io",
    } as Options;
  }
  return baseOptions as Options;
};

/**
 * Initialize and open the Wert widget
 * @param WertWidget - The Wert widget constructor
 * @param customOptions - Optional custom options to override defaults
 */
export const openWertWidget = (customOptions?: Partial<Options>) => {
  const options = {
    ...getWertOptions(),
    ...customOptions,
  };

  const wertWidget = new WertWidget(options);
  wertWidget.open();

  return wertWidget;
};
