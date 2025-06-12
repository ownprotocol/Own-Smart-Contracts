"use client";
import { type StakingFormData } from "@/types/staking";
import {
  type UseFormSetValue,
  type UseFormRegister,
} from "node_modules/react-hook-form/dist/types/form";
import { type FieldErrors } from "react-hook-form";
import { toast } from "react-toastify";
import DurationButton from "./duration-button";
import { FormInput } from "../ui/input";

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
  const handleLockUpDuration = (weeks: string) => {
    if (weeks && /^\d+(\.\d+)?$/.test(weeks)) {
      if (Number(weeks) > 208) {
        toast.warning("Lockup duration cannot be more than 4 years.");
        setValue("lockupDurationWeeks", 208, { shouldValidate: true });
        return;
      }

      setValue("lockupDurationWeeks", Number(weeks), { shouldValidate: true });
    } else {
      setValue("lockupDurationWeeks", 1, { shouldValidate: true });
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <FormInput
        title={title}
        errorString={errors.lockupDurationWeeks?.message}
        inputClassName="!text-black"
        inputProps={{ ...register("lockupDurationWeeks") }}
        onChange={(e) => handleLockUpDuration(e.target.value)}
      />
      <div className="flex flex-wrap justify-start gap-6">
        <DurationButton
          duration="1 Week"
          isSelected={lockupDuration === 1}
          onClick={() => handleLockUpDuration("1")}
        />
        <DurationButton
          duration="1 Month"
          isSelected={lockupDuration === 4}
          onClick={() => handleLockUpDuration("4")}
        />
        <div className="flex flex-col gap-1">
          <DurationButton
            duration="1 Year"
            isSelected={lockupDuration === 52}
            onClick={() => handleLockUpDuration("52")}
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
