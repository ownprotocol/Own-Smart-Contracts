/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import Image from "next/image";
import { useActiveAccount } from "thirdweb/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetAuthUser } from "@/query";
import { format, addWeeks } from "date-fns";

import { Button } from "../ui/button";
import {
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "../ui/drawer";
import { useGetBalanceUSDT, useGetCurrentPresaleRound } from "@/hooks";
import { toast } from "react-toastify";

const stakingSchema = z.object({
  tokenAmount: z
    .string()
    .min(1, { message: "Token amount must be more than 0 to stake." })
    .regex(/^\d+(\.\d+)?$/, {
      message: "Token amount must contain only numbers.",
    }),
  lockupDuration: z
    .string()
    .min(1, { message: "Lockup duration must be at least 1 week." })
    .regex(/^\d+(\.\d+)?$/, {
      message: "Lockup duration must contain only numbers.",
    }),
});

type StakingFormData = z.infer<typeof stakingSchema>;

const StakingDrawerContent = () => {
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
    // Set the value and trigger validation immediately
    setValue("lockupDuration", weeks ?? "", { shouldValidate: true });

    // Only proceed with additional logic if the input is a valid number
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
      // If input is not a valid number, reset the lockup duration
      setLockupDuration(0);
      setActiveDuration("");
    }
  };

  const handleInputToken = (
    e?: React.ChangeEvent<HTMLInputElement>,
    percentage?: number,
  ) => {
    const maxTokenAmount = Number(usdtBalance) / (currentOwnPrice ?? 1);

    // Handle percentage-based input
    if (percentage) {
      setActivePercentage(percentage);
      const tokenAmountNumber =
        (Number(usdtBalance) * (percentage / 100)) / (currentOwnPrice ?? 1);
      if (tokenAmountNumber > maxTokenAmount) {
        toast.warning(
          `You don't have enough balance to stake that amount. Max stake amount is ${maxTokenAmount.toFixed(2)}`,
        );
        setValue("tokenAmount", maxTokenAmount.toString(), {
          shouldValidate: true,
        });
        setTokensToStake(maxTokenAmount);
      } else {
        setValue("tokenAmount", tokenAmountNumber.toString(), {
          shouldValidate: true,
        });
        setTokensToStake(tokenAmountNumber);
      }
      return;
    }

    // Handle direct input - reset percentage selection when manually typing
    if (e) {
      setActivePercentage(null);
      const inputValue = e.target.value;
      // Set the value and trigger validation
      setValue("tokenAmount", inputValue, { shouldValidate: true });

      // Only check max amount and update tokens to stake if the input is a valid number
      if (/^\d+(\.\d+)?$/.test(inputValue)) {
        const tokenAmountNumber = Number(inputValue);
        setTokensToStake(tokenAmountNumber);

        if (tokenAmountNumber > maxTokenAmount) {
          toast.warning(
            `You don't have enough balance to stake that amount. Max stake amount is ${maxTokenAmount.toFixed(2)}`,
          );
          setValue("tokenAmount", maxTokenAmount.toString(), {
            shouldValidate: true,
          });
          setTokensToStake(maxTokenAmount);
        }
      } else {
        // If input is not a valid number, set tokensToStake to 0
        setTokensToStake(0);
      }
    }
  };

  const onSubmit = (data: StakingFormData) => {
    console.log(data);
  };

  const calculateUnlockDate = (durationInWeeks: number): string => {
    if (!durationInWeeks || durationInWeeks <= 0) return "N/A";

    const currentDate = new Date();
    const unlockDate = addWeeks(currentDate, durationInWeeks);
    return format(unlockDate, "MMM d yyyy HH:mm");
  };

  console.log(tokensToStake);

  return (
    <div className="mx-auto w-full px-[0%] pt-0 md:px-[5%] md:pt-8">
      <DrawerHeader className="relative">
        <DrawerClose className="absolute right-0 top-0">
          <span className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Close
          </span>
        </DrawerClose>
        <DrawerTitle className="text-black">
          <div className="flex w-full flex-col justify-center gap-1 md:flex-row md:gap-4">
            <div className="font-funnel w-full text-[24px] leading-[28px] tracking-[-5%] text-black lg:text-[32px] lg:leading-[38px] lg:tracking-[-5%] xl:text-[42px] xl:leading-[48px]">
              Stake tokens
            </div>
            <div className="flex w-full items-end justify-center gap-2 md:justify-start">
              <h1 className="font-dm_mono text-[12px] font-[400] leading-[14px] tracking-[8%] text-gray-500 md:text-[14px] md:leading-[16px]">
                BALANCE
              </h1>
              <Image
                src="/home-page/hero/subtract.png"
                alt="Subtract icon"
                width={15}
                height={15}
              />
              <p className="font-dm_mono text-[12px] font-[400] leading-[14px] tracking-[8%] text-black md:text-[14px] md:leading-[16px]">
                30,000
              </p>
            </div>
          </div>
        </DrawerTitle>
      </DrawerHeader>
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
                  <h2 className="font-dm_sans text-[16px] font-medium leading-[24px] text-black md:text-[18px] md:leading-[28px]">
                    Summary
                  </h2>
                  <div className="flex flex-col">
                    <SummaryRow
                      label="Token to be locked"
                      value={tokensToStake}
                    />
                    <SummaryRow label="Factor" value="0.99x" />
                    <SummaryRow
                      label="Lock-up Duration"
                      value={`${lockupDuration} weeks`}
                    />
                    <SummaryRow
                      label="Unlock Date"
                      value={calculateUnlockDate(lockupDuration)}
                    />
                  </div>
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
    </div>
  );
};

interface StakingButtonProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
}

const StakingButton = ({
  label,
  isSelected = false,
  onClick,
  isLoading,
}: StakingButtonProps) => {
  return (
    <button
      disabled={isLoading}
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 font-dm_sans text-[12px] font-medium leading-[24px] transition-colors md:px-8 md:text-[18px] md:leading-[28px] ${
        isSelected
          ? "bg-purple-700 text-white hover:bg-purple-800"
          : "bg-purple-100 text-purple-900 hover:bg-purple-200"
      }`}
    >
      {label}
    </button>
  );
};

interface DurationButtonProps {
  duration: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const DurationButton = ({
  duration,
  isSelected = false,
  onClick,
}: DurationButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-full px-4 py-2 font-dm_sans text-[12px] font-medium leading-[24px] transition-colors md:text-[18px] md:leading-[28px] ${
        isSelected
          ? "bg-purple-700 text-white hover:bg-purple-800"
          : "bg-purple-100 text-purple-900 hover:bg-purple-200"
      }`}
    >
      <span>{duration}</span>
    </button>
  );
};

interface SummaryRowProps {
  label: string;
  value: string | number;
}

const SummaryRow = ({ label, value }: SummaryRowProps) => (
  <div className="flex justify-between py-1 md:py-2">
    <span className="font-dm_sans text-[14px] leading-[20px] text-gray-500 md:text-[16px] md:leading-[24px]">
      {label}
    </span>
    <span className="font-dm_sans text-[14px] leading-[20px] text-black md:text-[16px] md:leading-[24px]">
      {value}
    </span>
  </div>
);

const RewardCard = () => {
  return (
    <div className="w-full">
      <h2 className="px-0 font-dm_sans text-[16px] font-medium leading-[24px] text-black md:px-0 md:text-[18px] md:leading-[28px]">
        My veOwn
      </h2>
      <div className="rounded-lg bg-purple-100 px-4 py-4 xl:mt-2 xl:py-8">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white/80 px-2 py-2 xl:py-4">
            <Image
              src="/own-logo.svg"
              alt="Own token"
              width={25}
              height={25}
              className="text-primary invert xl:h-[30px] xl:w-[30px]"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-dm_sans text-[32px] font-normal leading-[32px] tracking-[0.005] text-black md:text-[48px] md:leading-[48px]">
              2,000
            </span>
          </div>
        </div>
        <span className="font-dm_mono text-[12px] font-normal leading-[12px] tracking-[0.08em] text-gray-600 md:text-[14px] md:leading-[14px]">
          $VEOWN EARNED
        </span>
      </div>
    </div>
  );
};

export default StakingDrawerContent;
