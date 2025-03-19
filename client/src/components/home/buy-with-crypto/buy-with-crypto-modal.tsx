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
  setIsOpen: (isOpen: boolean) => void;
}

export const BuyWithCryptoDrawer = ({
  usdtBalance,
}: BuyWithCryptoModalProps) => {
  const { presaleContract, ownTokenContract } = useContracts();

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
      // TODO: Check allowance
      const stakingTx = prepareContractCall({
        contract: presaleContract,
        method: "purchasePresaleTokens",
        // TODO: Fix
        params: [1n, "0"],
      });
      // TODO: Send transaction

      onBuy(amount);
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while trying to buy with crypto");
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4 rounded-lg bg-white p-4">
      <div className="flex w-full flex-col gap-2"></div>
    </div>
  );
};
