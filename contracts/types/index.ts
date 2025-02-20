import { OWN$Type } from "../artifacts/contracts/OWN.sol/OWN";
import { GetContractReturnType, PublicClient, WalletClient } from "viem";

export type OwnContract = GetContractReturnType<
  OWN$Type["abi"],
  PublicClient | WalletClient
>;
