import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  BuyWithCryptoForm,
  buyWithCryptoSchema,
} from "./buy-with-crypto-modal.constants";
import { toast } from "react-toastify";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { useContracts } from "@/hooks";
import { prepareContractCall } from "thirdweb";
import Image from "next/image";
import { SectionLabel } from "./label";
import { FormInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatEther, parseEther } from "viem";
import { allowance } from "thirdweb/extensions/erc20";

interface BuyWithCryptoModalProps {
  usdtBalance: number;
  ownBalance: number;
  ownPrice: number;
  setIsOpen: (isOpen: boolean) => void;
}

export const BuyWithCryptoDrawer = ({
  usdtBalance,
  ownBalance,
  ownPrice,
}: BuyWithCryptoModalProps) => {
  const { presaleContract, ownTokenContract, usdtContract } = useContracts();
  const account = useActiveAccount();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<BuyWithCryptoForm>({
    resolver: zodResolver(buyWithCryptoSchema),
    defaultValues: {
      tokenAmount: "0",
    },
  });

  const { mutateAsync: sendTxAsync, isPending: isPendingSendTx } =
    useSendTransaction();

  const handleInputToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);

    if (isNaN(amount)) {
      setValue("tokenAmount", "0", {
        shouldValidate: true,
      });
      return;
    }

    if (amount > usdtBalance) {
      toast.warning(
        `You don't have enough balance to stake that amount. Max stake amount is ${usdtBalance.toFixed(2)}`,
      );
    }

    const amountToSet = Math.min(amount, usdtBalance);

    setValue("tokenAmount", amountToSet.toString(), {
      shouldValidate: true,
    });
  };

  const onSubmit = async (data: BuyWithCryptoForm) => {
    if (!account?.address) {
      throw new Error("Can't submit with missing fields");
    }
    const amount = parseFloat(data.tokenAmount);

    if (amount > usdtBalance) {
      toast.warning(
        `You don't have enough balance to stake that amount. Max stake amount is ${usdtBalance.toFixed(2)}`,
      );
      return;
    }

    const parsedAmount = parseEther(data.tokenAmount);

    const allowanceTx = await allowance({
      contract: usdtContract,
      owner: account.address,
      spender: presaleContract.address,
    });

    if (allowanceTx < amount) {
      try {
        const approvalTx = prepareContractCall({
          contract: usdtContract,
          method: "approve",
          params: [presaleContract.address, parsedAmount],
        });

        await sendTxAsync(approvalTx as any);
      } catch (approvalError) {
        toast.error("Approval failed");
        console.error("Approval error:", approvalError);
        return;
      }
    }

    try {
      const stakingTx = prepareContractCall({
        contract: presaleContract,
        method: "purchasePresaleTokens",
        // TODO: Fix
        params: [parseEther(data.tokenAmount), account.address],
      });
      // This library is stupid sometimes
      await sendTxAsync(stakingTx as any);
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while trying to buy with crypto");
    }
  };

  const amountToSpend = (() => {
    const tokenAmount = getValues("tokenAmount");
    return (ownPrice * parseFloat(tokenAmount)).toFixed(2);
  })();

  return (
    <div className="flex h-full w-full flex-col space-y-4 rounded-lg bg-white p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col justify-evenly"
      >
        <div className="flex">
          <div className="flex flex-1 flex-col gap-3">
            <SectionLabel>YOUR $OWN</SectionLabel>
            <div className="flex items-center gap-4">
              <Image
                src="/home-page/hero/subtract.png"
                alt="Subtract icon"
                width={15}
                height={15}
              />
              <p className="font-dm_mono text-[12px] font-[400] leading-[14px] tracking-[8%] text-black md:text-[22px] md:leading-[16px]">
                {ownBalance.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <SectionLabel>$OWN PRICE</SectionLabel>
            <div className="flex items-center gap-2">
              <p className="font-dm_mono text-[12px] font-[400] leading-[14px] tracking-[8%] text-black md:text-[22px] md:leading-[16px]">
                ${ownPrice.toLocaleString()}
              </p>
              <h1
                className={
                  "font-dm_mono text-[12px] font-[500] leading-[14px] tracking-[8%] text-gray-500 md:text-[24px] md:leading-[16px]"
                }
              >
                USDT
              </h1>
            </div>
          </div>
        </div>
        <div className="flex">
          <FormInput
            title={"ENTER USDT AMOUNT TO SPEND"}
            onChange={handleInputToken}
            errorString={errors.tokenAmount?.message}
            inputProps={{ ...register("tokenAmount"), placeholder: "0" }}
            className="!flex-1"
          />
          <FormInput
            title={"ENTER USDT AMOUNT TO SPEND"}
            onChange={handleInputToken}
            errorString={errors.tokenAmount?.message}
            inputProps={{
              placeholder: "0",
              disabled: true,
              value: amountToSpend,
            }}
            className="!flex-1"
          />
        </div>
        <div className="flex items-center gap-1">
          <Image
            src="/tether-logo.svg"
            alt="Own token"
            width={20}
            height={20}
          />
          <p className="font-dm_mono text-[12px] font-semibold leading-[14px] tracking-[8%] text-black md:text-[14px] md:leading-[16px]">
            TETHER BALANCE: {usdtBalance.toLocaleString()} USDT
          </p>
        </div>
        <div className="flex">
          <Button
            variant={"mainButton"}
            type="submit"
            disabled={!amountToSpend}
          >
            Buy {amountToSpend} $Own Tokens
          </Button>
        </div>
      </form>
    </div>
  );
};
