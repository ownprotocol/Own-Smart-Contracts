import { parseEther } from "viem";

export const OWN_MAX_SUPPLY = 2_250_000_000;
export const OWN_MAX_SUPPLY_WITH_DECIMALS = parseEther(
  OWN_MAX_SUPPLY.toString(),
);
