import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import WertWidget from "@wert-io/widget-initializer";
import axios from "axios";
import { type signSmartContractData } from "@wert-io/widget-sc-signer";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useActiveAccount,
  useActiveWallet,
  useWalletImage,
} from "thirdweb/react";

import {
  type BuyWithCardForm,
  buyWithCardSchema,
} from "./buy-with-card-modal.constants";

import { SectionLabel } from "./label";
import { FormInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buildWertOptions } from "@/config/wert-config";
import { useActiveChainWithDefault } from "@/hooks/useChainWithDefault";

interface BuyWithCardModalProps {
  usdtBalance: number;
  ownBalance: number;
  ownPrice: number;
  setIsOpen: (isOpen: boolean) => void;
  refetch: () => Promise<void>;
  maxAllocation: number;
}

export const BuyWithCardDrawer = ({
  usdtBalance,
  ownBalance,
  ownPrice,
  refetch,
  maxAllocation,
  setIsOpen,
}: BuyWithCardModalProps) => {
  const wallet = useActiveWallet();
  const { data: walletImage } = useWalletImage(wallet?.id);
  const account = useActiveAccount();
  const chain = useActiveChainWithDefault();
  const router = useRouter();
  const {
    register,
    setValue,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<BuyWithCardForm>({
    resolver: zodResolver(buyWithCardSchema(maxAllocation)),
    defaultValues: {
      tokenAmount: "0",
    },
  });

  const openWertWidgetHandler = async (amount: number) => {
    if (!account) return;

    const signedData = await axios.post<
      ReturnType<typeof signSmartContractData>
    >("/api/contracts/get-signed-presale-args", {
      amount,
      address: account.address,
      networkId: chain.id,
    });

    const wertWidget = new WertWidget({
      ...signedData.data,
      ...buildWertOptions(),
    });
    wertWidget.open();
  };

  const handleInputToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);

    if (isNaN(amount)) {
      setValue("tokenAmount", "0", {
        shouldValidate: true,
      });
      return;
    }

    setValue("tokenAmount", amount.toString(), {
      shouldValidate: true,
    });
  };

  const onSubmit = async () => {
    if (!account?.address) {
      throw new Error("Can't submit with missing fields");
    }

    const data = getValues();

    if (parseFloat(data.tokenAmount) > maxAllocation) {
      toast.error(
        `Not enough allocation. Maximum allocation is ${maxAllocation}`,
      );
      await trigger(["tokenAmount"], { shouldFocus: true });

      return;
    }

    try {
      const amount = parseFloat(data.tokenAmount);
      await openWertWidgetHandler(amount);
      await refetch();

      toast.success("Transaction successful");
      setTimeout(() => {
        setIsOpen(false);
        router.push("/presale");
      }, 1000);
    } catch (error) {
      toast.error("Transaction failed");
      console.error("Transaction error:", error);
    }
  };

  const amountToSpend = (() => {
    const tokenAmount = getValues("tokenAmount");
    return (ownPrice * parseFloat(tokenAmount)).toFixed(2);
  })();

  return (
    <div className="flex h-full w-full flex-col space-y-4 rounded-lg bg-white p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex h-full w-full flex-col gap-6"
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
            className="!flex-1 !text-gray-400"
            prefix="$"
          />
          <FormInput
            title={"$OWN YOU WILL RECEIVE"}
            onChange={handleInputToken}
            errorString={errors.tokenAmount?.message}
            inputProps={{
              placeholder: "0",
              disabled: true,
              value: amountToSpend,
            }}
            className="!flex-1"
            imageEnd={
              <Image
                width={20}
                height={20}
                src={walletImage ?? "/metamask-logo.png"}
                alt="metamask"
                className="h-8 w-8"
              />
            }
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
        <div className="!mt-auto flex">
          <Button
            variant={"mainButton"}
            useSpinner
            disabled={!amountToSpend}
            onClick={onSubmit}
          >
            Buy {amountToSpend} $Own Tokens
          </Button>
        </div>
      </form>
    </div>
  );
};
