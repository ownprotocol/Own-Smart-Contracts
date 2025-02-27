import { toUtf8Bytes } from "ethers";
import { keccak256 } from "viem";

export const formatRole = (role: string) => keccak256(toUtf8Bytes(role));

export const MINTER_ROLE = formatRole("MINTER_ROLE");
