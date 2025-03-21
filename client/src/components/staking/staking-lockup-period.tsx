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
        inputProps={{ ...register("lockupDurationWeeks") }}
        onChange={(e) => handleLockUpDuration(e.target.value)}
      />
      <div className="flex flex-wrap justify-around gap-2">
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
        <DurationButton
          duration="1 Year"
          isSelected={lockupDuration === 52}
          onClick={() => handleLockUpDuration("52")}
        />
      </div>
    </div>
  );
}

export default StakingLockupPeriod;
