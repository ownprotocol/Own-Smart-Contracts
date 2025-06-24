"use client";
import { type StakingFormData } from "@/types/staking";
import {
  type UseFormSetValue,
  type UseFormRegister,
} from "node_modules/react-hook-form/dist/types/form";
import { type FieldErrors } from "react-hook-form";
import { toast } from "react-toastify";
import { FormInput } from "../ui/input";
import StakingButton from "./staking-button";

interface StakingLockupPeriodProps {
  title: string;
  lockupDuration: number;
  register: UseFormRegister<StakingFormData>;
  setValue: UseFormSetValue<StakingFormData>;
  errors: FieldErrors<StakingFormData>;
}

function StakingLockupPeriod({
  title,
  lockupDuration,
  register,
  setValue,
  errors,
}: StakingLockupPeriodProps) {
  const handleLockUpDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    setValue("lockupDurationWeeks", Number(inputValue), {
      shouldValidate: true,
    });
  };

  const handlePresetWeeks = (weeks: number) => {
    setValue("lockupDurationWeeks", weeks, { shouldValidate: true });
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <FormInput
        title={title}
        errorString={errors.lockupDurationWeeks?.message}
        inputClassName="!text-black"
        inputProps={{ ...register("lockupDurationWeeks") }}
        onChange={handleLockUpDuration}
      />
      <div className="flex flex-wrap justify-start gap-6">
        <StakingButton
          label="1 Week"
          isSelected={lockupDuration === 1}
          onClick={() => handlePresetWeeks(1)}
        />
        <StakingButton
          label="1 Month"
          isSelected={lockupDuration === 4}
          onClick={() => handlePresetWeeks(4)}
        />
        <div className="flex flex-col gap-1">
          <StakingButton
            label="1 Year"
            isSelected={lockupDuration === 52}
            onClick={() => handlePresetWeeks(52)}
          />
          <div className="w-full pr-12 text-end font-dm_sans text-[10px] font-medium leading-[20px] text-orange-500 md:pr-40 md:text-[16px] md:leading-[24px]">
            MAX REWARD
          </div>
        </div>
      </div>
    </div>
  );
}

export default StakingLockupPeriod;
