import {
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { type StakingFormData } from "@/types/staking";
import Image from "next/image";
import StakingButton from "./staking-button";
import { useState } from "react";
import { toast } from "react-toastify";

interface StakingTokensProps {
  title: string;
  register: UseFormRegister<StakingFormData>;
  setValue: UseFormSetValue<StakingFormData>;
  errors: FieldErrors<StakingFormData>;
  usdtBalance: number;
  currentOwnPrice: number;
  setTokensToStake: (amount: number) => void;
  isLoading: boolean;
}

function StakingTokens({
  title,
  register,
  setValue,
  errors,
  usdtBalance,
  currentOwnPrice,
  setTokensToStake,
  isLoading,
}: StakingTokensProps) {
  const [activePercentage, setActivePercentage] = useState<number | null>(null);

  const handleInputToken = (
    e?: React.ChangeEvent<HTMLInputElement>,
    percentage?: number,
  ) => {
    const maxTokenAmount = Number(usdtBalance) / (currentOwnPrice ?? 1);
    let tokenAmountNumber = 0;

    const validateAndSetTokenAmount = (amount: number) => {
      if (amount > maxTokenAmount) {
        toast.warning(
          `You don't have enough balance to stake that amount. Max stake amount is ${maxTokenAmount.toFixed(2)}`,
        );
        setValue("tokenAmount", maxTokenAmount.toString(), {
          shouldValidate: true,
        });
        setTokensToStake(maxTokenAmount);
      } else {
        setValue("tokenAmount", amount.toString(), {
          shouldValidate: true,
        });
        setTokensToStake(amount);
      }
    };

    if (percentage) {
      setActivePercentage(percentage);
      tokenAmountNumber =
        (Number(usdtBalance) * (percentage / 100)) / (currentOwnPrice ?? 1);
      validateAndSetTokenAmount(tokenAmountNumber);
    }

    if (e) {
      setActivePercentage(null);
      const inputValue = e.target.value;
      setValue("tokenAmount", inputValue, { shouldValidate: true });

      if (/^\d+(\.\d+)?$/.test(inputValue)) {
        tokenAmountNumber = Number(inputValue);
        validateAndSetTokenAmount(tokenAmountNumber);
      } else {
        setTokensToStake(0);
      }
    }
  };
  return (
    <div className="flex w-full flex-col gap-2">
      <h1 className="font-dm_mono text-[10px] font-[400] leading-[14px] tracking-[8%] text-gray-500 md:text-[14px] md:leading-[16px]">
        {title}
      </h1>
      <div className="flex items-center border-2 border-gray-500/50 bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
        <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6">
          <div className="rounded-full border-2 border-gray-500 px-2 py-1.5 text-gray-500 opacity-50">
            <Image
              src="/own-logo.svg"
              alt="Own token"
              width={20}
              height={20}
              className="text-primary invert xl:h-[25px] xl:w-[25px]"
            />
          </div>
        </div>
        <input
          id="tokenAmount"
          type="text"
          placeholder="0.00"
          className="block w-1/2 min-w-0 grow py-2 pl-4 pr-3 font-dm_sans text-[16px] leading-[20px] tracking-[0.5%] text-gray-900 text-primary placeholder:text-gray-400 focus:outline-none xl:py-4 xl:text-[20px] xl:leading-[24px]"
          {...register("tokenAmount")}
          onChange={handleInputToken}
        />
      </div>
      <p className="h-2 font-dm_mono text-[8px] font-[400] leading-[14px] tracking-[8%] text-red-500 md:text-[14px] md:leading-[16px]">
        {errors.tokenAmount?.message}
      </p>
      <div className="flex flex-wrap justify-around gap-2">
        <StakingButton
          label="25%"
          isSelected={activePercentage === 25}
          isLoading={isLoading}
          onClick={() => handleInputToken(undefined, 25)}
        />
        <StakingButton
          label="50%"
          isSelected={activePercentage === 50}
          isLoading={isLoading}
          onClick={() => handleInputToken(undefined, 50)}
        />
        <StakingButton
          label="75%"
          isSelected={activePercentage === 75}
          isLoading={isLoading}
          onClick={() => handleInputToken(undefined, 75)}
        />
        <StakingButton
          label="Max"
          isSelected={activePercentage === 100}
          isLoading={isLoading}
          onClick={() => handleInputToken(undefined, 100)}
        />
      </div>
    </div>
  );
}

export default StakingTokens;
