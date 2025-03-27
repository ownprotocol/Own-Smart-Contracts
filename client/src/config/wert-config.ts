import type { Options } from "@wert-io/widget-initializer/types";
import { v4 as uuidv4 } from "uuid";
import { MAIN_CHAIN } from "./contracts";
import { sepolia } from "thirdweb/chains";

export const getCommodityForNetworkId = (networkId: number): string => {
  if (networkId === sepolia.id) {
    // Wert uses this mock token on sepolia: https://sepolia.etherscan.io/address/0x2ff0ec69341f43cc462251bd49bb63681adafcb0
    return "ETH";
  }

  if (networkId === MAIN_CHAIN.id) {
    return "USDT";
  }

  throw new Error(`Unsupported Wert network: ${networkId}`);
};

/**
 * Return only the base options in production
 * Get Wert widget configuration options
 * @returns Wert widget options
 */
export const buildWertOptions = (
  amount: number,
  contract_address: string,
  contract_input_data: string,
  networkId: number,
): Options => {
  const origin =
    process.env.NODE_ENV === "development"
      ? "https://sandbox.wert.io"
      : "TODO:This";

  return {
    partner_id: process.env.NEXT_PUBLIC_WERT_PARTNER_ID!,
    click_id: uuidv4(),
    network: MAIN_CHAIN.name,
    commodity: getCommodityForNetworkId(networkId),
    commodity_amount: amount,
    color_buttons: "#C58BFF",
    color_buttons_text: "#000000",
    sc_input_data: contract_input_data,
    sc_address: contract_address,
    origin,

    // listeners: {
    //   loaded: () => console.log("Wert widget loaded"),
    //   "payment-status": (data) => console.log("Payment status:", data),
    //   close: () => console.log("Widget closed"),
    // },
  };
};
