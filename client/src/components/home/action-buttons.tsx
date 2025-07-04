"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

import { BuyWithCryptoDrawer } from "./buy-with-crypto/buy-with-crypto-modal";
import { type CurrentPresaleRoundDetails } from "@/types/presale";
import { CustomDrawer } from "../drawer";
import { toast } from "react-toastify";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { useContracts } from "@/hooks";
import { allowance } from "thirdweb/extensions/erc20";
import axios from "axios";
import { type signSmartContractData } from "@wert-io/widget-sc-signer";
import { useActiveChainWithDefault } from "@/hooks/useChainWithDefault";
import WertWidget from "@wert-io/widget-initializer";
import { buildWertOptions } from "@/config/wert-config";
import { maxUint256, parseUnits } from "viem";

interface ActionButtonsProps {
  ownBalance: number;
  usdtBalance: number;
  ownPrice: number;
  refetch: () => Promise<void>;
  presaleAllocation: CurrentPresaleRoundDetails["roundDetails"]["allocation"];
  preSaleSold: CurrentPresaleRoundDetails["roundDetails"]["sales"];
}

function ActionButtons({
  ownBalance,
  usdtBalance,
  ownPrice,
  refetch,
  presaleAllocation,
  preSaleSold,
}: ActionButtonsProps) {
  const account = useActiveAccount();
  const chain = useActiveChainWithDefault();

  const { presaleContract, usdtContract } = useContracts();

  const [buyWithCryptoOpen, setBuyWithCryptoOpen] = useState(false);
  const [buyWithCardOpen, setBuyWithCardOpen] = useState(false);

  // When the presale round had sold out, the preSaleSold is greater than presaleAllocation. This was resulting in negative value
  const maxAllocation = Math.max(0, presaleAllocation - preSaleSold);

  const buyWithCryptoSubmit = async (amount: number) => {
    if (!account?.address) {
      toast.error("Please connect your wallet");
      return;
    }

    const parsedAmount = parseUnits(amount.toString(), 6);

    const allowanceTx = await allowance({
      contract: usdtContract,
      owner: account.address,
      spender: presaleContract.address,
    });

    if (allowanceTx < amount) {
      if (allowanceTx !== 0n) {
        await sendAndConfirmTransaction({
          account,
          transaction: prepareContractCall({
            contract: usdtContract,
            method: "approve",
            params: [presaleContract.address, 0n],
          }),
        });
      }

      await sendAndConfirmTransaction({
        account,
        transaction: prepareContractCall({
          contract: usdtContract,
          method: "approve",
          // Max out the approvals here to avoid the USDC approval issues
          params: [presaleContract.address, maxUint256],
        }),
      });

      toast.success("Approval successful");
    }

    await sendAndConfirmTransaction({
      account,
      transaction: prepareContractCall({
        contract: presaleContract,
        method: "purchasePresaleTokens",
        params: [parsedAmount, account.address],
      }),
    });

    await refetch();

    toast.success("Transaction successful");
    setTimeout(() => {
      setBuyWithCryptoOpen(false);
    }, 1000);
  };

  const buyWithCardSubmit = async (amount: number) => {
    if (!account?.address) {
      toast.error("Please connect your wallet");
      return;
    }
    const parsedAmount = parseFloat(amount.toString());

    setBuyWithCardOpen(false);

    const signedData = await axios.post<
      ReturnType<typeof signSmartContractData>
    >("/api/contracts/get-signed-presale-args", {
      amount: parsedAmount,
      address: account.address,
      networkId: chain.id,
    });

    const wertWidget = new WertWidget({
      ...signedData.data,
      ...buildWertOptions(),
    });
    wertWidget.open();
  };

  return (
    <div className="mt-4 flex flex-col gap-3 p-4 md:flex-row md:justify-center md:gap-4">
      {/* Card payment button */}

      <CustomDrawer
        button={
          <Button variant="mainButton" size="lg">
            Buy with Credit Card
          </Button>
        }
        title="Buy with Credit Card"
        isOpen={buyWithCardOpen}
        onOpenChange={setBuyWithCardOpen}
      >
        <BuyWithCryptoDrawer
          setIsOpen={setBuyWithCryptoOpen}
          usdtBalance={usdtBalance}
          ownBalance={ownBalance}
          ownPrice={ownPrice}
          maxAllocation={maxAllocation}
          submit={buyWithCardSubmit}
          type="card"
        />
      </CustomDrawer>
      <CustomDrawer
        button={
          <Button variant="secondary" size="lg">
            Buy with Crypto
          </Button>
        }
        title="Buy with Crypto"
        isOpen={buyWithCryptoOpen}
        onOpenChange={setBuyWithCryptoOpen}
      >
        <BuyWithCryptoDrawer
          setIsOpen={setBuyWithCryptoOpen}
          usdtBalance={usdtBalance}
          ownBalance={ownBalance}
          ownPrice={ownPrice}
          maxAllocation={maxAllocation}
          submit={buyWithCryptoSubmit}
          type="crypto"
        />
      </CustomDrawer>
    </div>
  );
}

export default ActionButtons;
