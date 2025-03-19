"use client";
import { type StakingFormData } from "@/types/staking";
import {
  type UseFormSetValue,
  type UseFormRegister,
} from "node_modules/react-hook-form/dist/types/form";
import { type Dispatch, type SetStateAction, useState } from "react";
import { type FieldErrors } from "react-hook-form";
import { toast } from "react-toastify";
import DurationButton from "./duration-button";
import { FormInput } from "../ui/input";

interface StakingLockupPeriodProps {
  title: string;
  setLockupDuration: Dispatch<SetStateAction<number>>;
  register: UseFormRegister<StakingFormData>;
  setValue: UseFormSetValue<StakingFormData>;
  errors: FieldErrors<StakingFormData>;
}

function StakingLockupPeriod({
  title,
  setLockupDuration,
  register,
  setValue,
  errors,
}: StakingLockupPeriodProps) {
  const [activeDuration, setActiveDuration] = useState<string>("");

  const handleLockUpDuration = (duration?: string, weeks?: string) => {
    setValue("lockupDuration", weeks ?? "", { shouldValidate: true });
    if (weeks && /^\d+(\.\d+)?$/.test(weeks)) {
      if (Number(weeks) > 208) {
        toast.warning("Lockup duration cannot be more than 4 years.");
        setValue("lockupDuration", "208", { shouldValidate: true });
        setLockupDuration(208);
        setActiveDuration("4 Year");
        return;
      }

      setActiveDuration(duration ?? "");
      setLockupDuration(Number(weeks));
    } else {
      setLockupDuration(0);
      setActiveDuration("");
    }
  };
  return (
    <div className="flex w-full flex-col gap-2">
      <FormInput
        title={title}
        errorString={errors.lockupDuration?.message}
        inputProps={{ ...register("lockupDuration") }}
        onChange={(e) => handleLockUpDuration(undefined, e.target.value)}
      />
      <div className="flex flex-wrap justify-around gap-2">
        <DurationButton
          duration="1 Week"
          isSelected={activeDuration === "1 Week"}
          onClick={() => handleLockUpDuration("1 Week", "1")}
        />
        <DurationButton
          duration="1 Month"
          isSelected={activeDuration === "1 Month"}
          onClick={() => handleLockUpDuration("1 Month", "4")}
        />
        <DurationButton
          duration="1 Year"
          isSelected={activeDuration === "1 Year"}
          onClick={() => handleLockUpDuration("1 Year", "52")}
        />
        <DurationButton
          duration="4 Year"
          isSelected={activeDuration === "4 Year"}
          onClick={() => handleLockUpDuration("4 Year", "208")}
        />
      </div>
    </div>
  );
}

export default StakingLockupPeriod;
