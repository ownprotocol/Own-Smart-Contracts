"use client";

import Image from "next/image";
import { useActiveAccount } from "thirdweb/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import { Button } from "../ui/button";
import { useGetAuthUser } from "@/query";
import { DrawerFooter } from "../ui/drawer";
import { useGetBalanceUSDT, useGetCurrentPresaleRound } from "@/hooks";
import StakingButton from "./staking-button";
import DurationButton from "./duration-button";

import RewardCard from "./reward-card";
import { stakingSchema, type StakingFormData } from "@/types/staking";
import StakingSummary from "./staking-summary";

function StakingForm() {
  const activeAccount = useActiveAccount();
  const { presaleData, isLoading: isLoadingPresaleRound } =
    useGetCurrentPresaleRound();

  const { usdtBalance, isLoading: isLoadingUsdtBalance } = useGetBalanceUSDT(
    activeAccount?.address ?? "",
  );
  const currentOwnPrice =
    presaleData?.round.price === 0 ? 2 : presaleData?.round.price;
  const [tokensToStake, setTokensToStake] = useState<number>(0);
  const [lockupDuration, setLockupDuration] = useState<number>(0);
  const [activePercentage, setActivePercentage] = useState<number | null>(null);
  const [activeDuration, setActiveDuration] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StakingFormData>({
    resolver: zodResolver(stakingSchema),
    defaultValues: {
      tokenAmount: "",
      lockupDuration: "",
    },
  });

  const { isValid } = useGetAuthUser();

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

  const onSubmit = (data: StakingFormData) => {
    console.log(data);
  };
  return (
    <div className="px-4 py-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-0 md:gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex w-full flex-col gap-2">
              <h1 className="font-dm_mono text-[10px] font-[400] leading-[14px] tracking-[8%] text-gray-500 md:text-[14px] md:leading-[16px]">
                Enter TOKENS TO STAKE
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
                  isLoading={isLoadingUsdtBalance || isLoadingPresaleRound}
                  onClick={() => handleInputToken(undefined, 25)}
                />
                <StakingButton
                  label="50%"
                  isSelected={activePercentage === 50}
                  isLoading={isLoadingUsdtBalance || isLoadingPresaleRound}
                  onClick={() => handleInputToken(undefined, 50)}
                />
                <StakingButton
                  label="75%"
                  isSelected={activePercentage === 75}
                  isLoading={isLoadingUsdtBalance || isLoadingPresaleRound}
                  onClick={() => handleInputToken(undefined, 75)}
                />
                <StakingButton
                  label="Max"
                  isSelected={activePercentage === 100}
                  isLoading={isLoadingUsdtBalance || isLoadingPresaleRound}
                  onClick={() => handleInputToken(undefined, 100)}
                />
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <h1 className="font-dm_mono text-[10px] font-[400] leading-[14px] tracking-[8%] text-gray-500 md:text-[14px] md:leading-[16px]">
                LOCK UP PERIOD
              </h1>
              <div className="flex items-center border-2 border-gray-500/50 bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <input
                  type="text"
                  {...register("lockupDuration")}
                  onChange={(e) =>
                    handleLockUpDuration(undefined, e.target.value)
                  }
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
          </div>
          <div className="w-full text-end font-dm_sans text-[10px] font-medium leading-[20px] text-orange-500 md:text-[16px] md:leading-[24px]">
            MAX REWARD
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:gap-4">
            <div className="flex w-full flex-col gap-2">
              <div className="w-full rounded-lg px-0 md:px-4">
                <StakingSummary
                  tokensToStake={tokensToStake}
                  lockupDuration={lockupDuration}
                />
              </div>
              <div className="w-full"></div>
            </div>
            <div className="w-full">
              <RewardCard />
            </div>
          </div>
          <DrawerFooter className="flex justify-start">
            <Button
              disabled={!isValid}
              className="w-full rounded-lg bg-purple-700 px-4 py-2 font-dm_sans text-[14px] font-medium leading-[20px] text-white transition-colors hover:bg-purple-800 md:max-w-fit md:px-8 md:text-[18px] md:leading-[28px]"
            >
              Stake
            </Button>
          </DrawerFooter>
        </div>
      </form>
    </div>
  );
}

export default StakingForm;
