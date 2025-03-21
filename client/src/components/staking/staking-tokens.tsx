"use client";

import {
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";

import StakingButton from "./staking-button";
import { type StakingFormData } from "@/types/staking";
import { FormInput } from "../ui/input";

interface StakingTokensProps {
  title: string;
  register: UseFormRegister<StakingFormData>;
  setValue: UseFormSetValue<StakingFormData>;
  errors: FieldErrors<StakingFormData>;
  ownBalance: number;
}

function StakingTokens({
  title,
  register,
  setValue,
  errors,
  ownBalance,
}: StakingTokensProps) {
  const [activePercentage, setActivePercentage] = useState<number | null>(null);

  const handleInputToken = (
    e?: React.ChangeEvent<HTMLInputElement>,
    percentage?: number,
  ) => {
    const maxTokenAmount = ownBalance;
    let tokenAmountNumber = 0;

    const validateAndSetTokenAmount = (amount: number) => {
      if (amount > maxTokenAmount) {
        toast.warning(
          `You don't have enough balance to stake that amount. Max stake amount is ${maxTokenAmount.toFixed(2)}`,
        );
        setValue("tokenAmount", maxTokenAmount, {
          shouldValidate: true,
        });
      } else {
        setValue("tokenAmount", amount, {
          shouldValidate: true,
        });
      }
    };

    if (percentage) {
      setActivePercentage(percentage);
      tokenAmountNumber = ownBalance * (percentage / 100);
      validateAndSetTokenAmount(tokenAmountNumber);
    }

    if (e) {
      setActivePercentage(null);
      const inputValue = e.target.value;

      if (/^\d+(\.\d+)?$/.test(inputValue)) {
        tokenAmountNumber = Number(inputValue);
        validateAndSetTokenAmount(tokenAmountNumber);
      } else {
        setValue("tokenAmount", 0, {
          shouldValidate: true,
        });
      }
    }
  };
  return (
    <div className="flex w-full flex-col gap-2">
      <FormInput
        title={title}
        onChange={handleInputToken}
        errorString={errors.tokenAmount?.message}
        inputProps={{ ...register("tokenAmount") }}
        image={
          <Image
            src="/own-logo.svg"
            alt="Own token"
            width={20}
            height={20}
            className="text-primary invert xl:h-[25px] xl:w-[25px]"
          />
        }
      />
      <div className="flex flex-wrap justify-around gap-2">
        <StakingButton
          label="25%"
          isSelected={activePercentage === 25}
          onClick={() => handleInputToken(undefined, 25)}
        />
        <StakingButton
          label="50%"
          isSelected={activePercentage === 50}
          onClick={() => handleInputToken(undefined, 50)}
        />
        <StakingButton
          label="75%"
          isSelected={activePercentage === 75}
          onClick={() => handleInputToken(undefined, 75)}
        />
        <StakingButton
          label="Max"
          isSelected={activePercentage === 100}
          onClick={() => handleInputToken(undefined, 100)}
        />
      </div>
    </div>
  );
}

export default StakingTokens;
