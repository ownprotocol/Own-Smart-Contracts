/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { signSmartContractData } from "@wert-io/widget-sc-signer";
import { z } from "zod";
import { encodeFunctionData, parseEther } from "viem";
import { presaleABI } from "@/constants/abi";
import { getContractAddresses } from "@/config/contracts";
import { sepolia } from "thirdweb/chains";

const bodySchema = z.object({
  address: z.string(),
  amount: z.number(),
  networkId: z.union([z.literal(1), z.literal(sepolia.id)]),
});

const privateKey = process.env.WERT_PRIVATE_KEY!;

export async function POST(req: Request) {
  const { address, amount, networkId } = bodySchema.parse(await req.json());

  const data = encodeFunctionData({
    abi: presaleABI,
    functionName: "purchasePresaleTokens",
    args: [parseEther(amount.toString()), address],
  });

  const { presaleAddress } = getContractAddresses(networkId);

  const signedData = signSmartContractData(
    {
      address,
      commodity: networkId === 1 ? "USDT" : "TT",
      network: networkId === 1 ? "ethereum" : "sepolia",
      commodity_amount: amount,
      sc_address: presaleAddress,
      sc_input_data: data,
    },
    privateKey,
  );

  return new Response(JSON.stringify(signedData));
}
