"use client";

import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { allowance } from "thirdweb/extensions/erc20";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { type AbiFunction } from "thirdweb/utils";
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
import StakingLockupPeriod from "./staking-lockup-period";
import StakingTokens from "./staking-tokens";
import StakingSummary from "./staking-summary";
import { getContractAddresses } from "@/config/contracts";
import { type Network } from "@/types";

interface StakingProps {
  ownBalance: string;
  ownTokenSymbol?: string;
  needsSwitch: boolean;
}

function Staking({ ownBalance, needsSwitch }: StakingProps) {
  const { isValid } = useGetAuthUser();
  const activeAccount = useActiveAccount();
  const { stakeContract, ownTokenContract } = useContracts();
  const { stakeAddress } = getContractAddresses(
    process.env.NEXT_PUBLIC_NETWORK as Network,
  );

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

  const onSubmit = async (data: StakingFormData) => {
    console.log(data);
    const amount = toWei(data.tokenAmount);
    const days = BigInt(data.lockupDuration);

    //allowance check
    const allowanceTx = await allowance({
      contract: ownTokenContract,
      owner: activeAccount?.address ?? "",
      spender: stakeAddress,
    });

    // check if approval is needed
    if (allowanceTx < amount) {
      const approvalTx = prepareContractCall({
        contract: ownTokenContract,
        method: "approve",
        params: [stakeAddress, amount],
      });

      sendTx(
        approvalTx as PreparedTransaction<
          [],
          AbiFunction,
          PrepareTransactionOptions
        >,
        {
          onSuccess: () => {
            toast.success("Approval successful");
          },
          onError: (error) => {
            toast.error("Approval failed");
            console.log({ error });
          },
        },
      );
    }

    const stakingTx = prepareContractCall({
      contract: stakeContract,
      method: "stake",
      params: [amount, days * 7n],
    });
    sendTx(
      stakingTx as PreparedTransaction<
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
          console.log({ stakingTx });
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
                <RewardCard
                  tokensToStake={tokensToStake}
                  lockupDuration={lockupDuration}
                  factor={0.99}
                />
              </div>
            </div>
            <DrawerFooter className="flex justify-start">
              <Button
                disabled={!isValid || tokensToStake === 0 || needsSwitch}
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
