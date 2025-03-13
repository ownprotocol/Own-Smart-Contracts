"use client";

import { useSendTransaction } from "thirdweb/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  prepareContractCall,
  type PreparedTransaction,
  type PrepareTransactionOptions,
  toWei,
} from "thirdweb";

import { Button } from "../ui/button";
import { useGetAuthUser } from "@/query";
import { DrawerFooter } from "../ui/drawer";
import { useContracts } from "@/hooks";
import RewardCard from "./reward-card";
import { stakingSchema, type StakingFormData } from "@/types/staking";
import StakingSummary from "./staking-summary";
import StakingLockupPeriod from "./staking-lockup-period";
import StakingTokens from "./staking-tokens";
import { toast } from "react-toastify";
import { type AbiFunction } from "thirdweb/utils";

interface StakingProps {
  ownBalance: string;
  ownTokenSymbol?: string;
}

function Staking({ ownBalance }: StakingProps) {
  const { isValid } = useGetAuthUser();
  const { stakeContract } = useContracts();

  const {
    mutate: sendTx,
    data: transactionResult,
    isPending: isPendingSendTx,
  } = useSendTransaction();

  const [tokensToStake, setTokensToStake] = useState<number>(0);
  const [lockupDuration, setLockupDuration] = useState<number>(0);

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

  const onSubmit = (data: StakingFormData) => {
    console.log(data);
    const amount = toWei(data.tokenAmount);
    const days = BigInt(data.lockupDuration);

    const transaction = prepareContractCall({
      contract: stakeContract,
      method: "stake",
      params: [amount, days],
    });
    sendTx(
      transaction as PreparedTransaction<
        [],
        AbiFunction,
        PrepareTransactionOptions
      >,
      {
        onSuccess: () => {
          toast.success("Stake successful");
        },
        onError: (error) => {
          toast.error("Stake failed");
          console.log({ error });
          console.log({ transaction });
          console.log({ transactionResult });
        },
      },
    );
  };
  return (
    <div className="px-4 py-2">
      {isPendingSendTx && (
        <div className="flex items-center justify-center text-primary">
          Loading...
        </div>
      )}

      {!isPendingSendTx && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-0 md:gap-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <StakingTokens
                title="Enter TOKENS TO STAKE"
                register={register}
                setValue={setValue}
                errors={errors}
                ownBalance={Number(ownBalance ?? 0)}
                setTokensToStake={setTokensToStake}
              />

              <StakingLockupPeriod
                title="LOCK UP PERIOD"
                setLockupDuration={setLockupDuration}
                register={register}
                setValue={setValue}
                errors={errors}
              />
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
      )}
    </div>
  );
}

export default Staking;
