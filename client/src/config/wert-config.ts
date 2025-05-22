import type { Options } from "@wert-io/widget-initializer/types";
import { v4 as uuidv4 } from "uuid";
import { MAIN_CHAIN } from "./contracts";
import { sepolia } from "thirdweb/chains";
import { env } from "@/env";

/**
 * Return only the base options in production
 * Get Wert widget configuration options
 * @returns Wert widget options
 */
export const buildWertOptions = (): Options => {
  // const origin =
  //   process.env.NODE_ENV === "development"
  //     ? "https://sandbox.wert.io"
  //     : undefined;
  const origin = "https://sandbox.wert.io";

  return {
    partner_id: env.NEXT_PUBLIC_WERT_PARTNER_ID!,
    click_id: uuidv4(),
    origin,
  };
};
