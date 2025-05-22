import { signSmartContractData } from "@wert-io/widget-sc-signer";
import { z } from "zod";
import { encodeFunctionData, parseEther } from "viem";
import { presaleABI } from "@/constants/abi";
import {
  getContractAddresses,
  type SupportedNetworkIds,
} from "@fasset/contracts";
import { sepolia } from "thirdweb/chains";
import { env } from "@/env";

const bodySchema = z.object({
  address: z.string(),
  amount: z.number(),
  networkId: z.literal(sepolia.id),
});

const privateKey = env.WERT_PRIVATE_KEY!;

export async function POST(req: Request) {
  const { address, amount, networkId } = bodySchema.parse(await req.json());

  const data = encodeFunctionData({
    abi: presaleABI,
    functionName: "purchasePresaleTokens",
    args: [parseEther(amount.toString()), address],
  });

  const { presaleAddress } = getContractAddresses(
    networkId as SupportedNetworkIds,
  );

  const signedData = signSmartContractData(
    {
      address,
      commodity: "TT",
      network: "sepolia",
      commodity_amount: amount,
      sc_address: presaleAddress,
      sc_input_data: data,
    },
    privateKey,
  );

  return new Response(JSON.stringify(signedData));
}
