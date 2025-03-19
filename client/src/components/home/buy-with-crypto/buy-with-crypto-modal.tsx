import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  BuyWithCryptoForm,
  buyWithCryptoSchema,
} from "./buy-with-crypto-modal.constants";
import { toast } from "react-toastify";
import { useSendTransaction } from "thirdweb/react";
import { useContracts } from "@/hooks";
import { prepareContractCall } from "thirdweb";

interface BuyWithCryptoModalProps {
  usdtBalance: number;
  onBuy: (amount: number) => void;
}

export const BuyWithCryptoModal = ({
  usdtBalance,
  onBuy,
}: BuyWithCryptoModalProps) => {
  const { presaleContract } = useContracts();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BuyWithCryptoForm>({
    resolver: zodResolver(buyWithCryptoSchema),
    defaultValues: {
      tokenAmount: "",
    },
  });

  const { mutateAsync: sendTxAsync, isPending: isPendingSendTx } =
    useSendTransaction();

  const handleInputToken = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);

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
    const amount = parseFloat(data.tokenAmount);

    if (amount > usdtBalance) {
      toast.warning(
        `You don't have enough balance to stake that amount. Max stake amount is ${usdtBalance.toFixed(2)}`,
      );
      return;
    }

    try {
      const stakingTx = prepareContractCall({
        contract: presaleContract,
        method: "purchasePresaleTokens",
        params: [amount, days * 7n],
      });

      await sendTxAsync({
        contract: ownTokenContract,
        method: "approve",
        params: ["presaleAddress", amount],
      });

      onBuy(amount);
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while trying to buy with crypto");
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4 rounded-lg bg-white p-4">
    <div className="flex w-full flex-col gap-2">
      <h1 className="font-dm_mono text-[10px] font-[400] leading-[14px] tracking-[8%] text-gray-500 md:text-[14px] md:leading-[16px]">
        {title}
      </h1>
      <input
        id="tokenAmount"
        type="text"
        placeholder="0.00"
        className="block w-1/2 min-w-0 grow py-2 pl-4 pr-3 font-dm_sans text-[16px] leading-[20px] tracking-[0.5%] text-gray-900 text-primary placeholder:text-gray-400 focus:outline-none xl:py-4 xl:text-[20px] xl:leading-[24px]"
        {...register("tokenAmount")}
        onChange={handleInputToken}
      />
      <p className="h-2 font-dm_mono text-[8px] font-[400] leading-[14px] tracking-[8%] text-red-500 md:text-[14px] md:leading-[16px]">
        {errors.tokenAmount?.message}
      </p>
    </div>
  );
};
