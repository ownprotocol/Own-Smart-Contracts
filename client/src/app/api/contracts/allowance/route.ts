import { type NextRequest, NextResponse } from "next/server";
import { allowance } from "thirdweb/extensions/erc20";
import { getContract } from "thirdweb";

import { activeChain } from "@/config/chain";
import { client } from "@/lib/client";

export async function GET(request: NextRequest) {
  console.log("allowance route");
  try {
    const searchParams = request.nextUrl.searchParams;
    const owner = searchParams.get("owner");
    const spender = searchParams.get("spender");
    const ownTokenAddress = searchParams.get("ownTokenAddress");

    if (!owner || !spender) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: owner and spender addresses are required",
        },
        { status: 400 },
      );
    }

    if (!ownTokenAddress) {
      return NextResponse.json(
        { error: "Token contract address not provided or available" },
        { status: 400 },
      );
    }

    const contract = getContract({
      address: ownTokenAddress,
      chain: activeChain,
      client: client,
    });

    const allowanceAmount = await allowance({
      contract,
      owner,
      spender,
    });

    return NextResponse.json({ allowance: allowanceAmount.toString() });
  } catch (error) {
    console.error("Allowance API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch allowance" },
      { status: 500 },
    );
  }
}
