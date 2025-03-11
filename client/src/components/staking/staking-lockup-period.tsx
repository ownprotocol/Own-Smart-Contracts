/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type StakingFormData } from "@/types/staking";
import {
  type UseFormSetValue,
  type UseFormRegister,
} from "node_modules/react-hook-form/dist/types/form";
import { type Dispatch, type SetStateAction, useState } from "react";
import { type FieldErrors } from "react-hook-form";
import { toast } from "react-toastify";
import DurationButton from "./duration-button";

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
      <h1 className="font-dm_mono text-[10px] font-[400] leading-[14px] tracking-[8%] text-gray-500 md:text-[14px] md:leading-[16px]">
        {title}
      </h1>
      <div className="flex items-center border-2 border-gray-500/50 bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
        <input
          type="text"
          {...register("lockupDuration")}
          onChange={(e) => handleLockUpDuration(undefined, e.target.value)}
          placeholder="0"
          className="block w-1/2 min-w-0 grow py-2 pl-4 pr-3 font-dm_sans text-[16px] leading-[20px] tracking-[0.5%] text-gray-900 text-primary placeholder:text-gray-400 focus:outline-none xl:py-4 xl:text-[20px] xl:leading-[24px]"
        />
      </div>
      <p className="h-2 font-dm_mono text-[8px] font-[400] leading-[14px] tracking-[8%] text-red-500 md:text-[14px] md:leading-[16px]">
        {errors.lockupDuration?.message}
      </p>
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
