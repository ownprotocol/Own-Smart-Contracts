"use client";

import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { type Dispatch, type SetStateAction } from "react";
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
import { useGetAllowance } from "@/query/get-allowance";

interface StakingProps {
  ownBalance: string;
  ownTokenSymbol?: string;
  needsSwitch: boolean;
  tokensToStake: number;
  lockupDuration: number;
  setTokensToStake: Dispatch<SetStateAction<number>>;
  setLockupDuration: Dispatch<SetStateAction<number>>;
}

function Staking({
  ownBalance,
  needsSwitch,
  tokensToStake,
  lockupDuration,
  setTokensToStake,
  setLockupDuration,
}: StakingProps) {
  const { isValid } = useGetAuthUser();
  const activeAccount = useActiveAccount();
  const { stakeContract, ownTokenContract } = useContracts();
  const { stakeAddress } = getContractAddresses();
  const { allowance: allowanceData, isLoading: isLoadingAllowance } =
    useGetAllowance(
      activeAccount?.address ?? "",
      stakeAddress,
      ownTokenContract.address,
    );

  console.log(isLoadingAllowance);

  const { mutateAsync: sendTxAsync, isPending: isPendingSendTx } =
    useSendTransaction();

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
    try {
      const amount = toWei(data.tokenAmount);
      const days = BigInt(data.lockupDuration);

      const allowanceTx = BigInt(allowanceData ?? 0);
      // check if approval is needed
      if (allowanceTx < amount) {
        try {
          const approvalTx = prepareContractCall({
            contract: ownTokenContract,
            method: "approve",
            params: [stakeAddress, amount],
          });

          await sendTxAsync(
            approvalTx as PreparedTransaction<
              [],
              AbiFunction,
              PrepareTransactionOptions
            >,
          );
          toast.success("Approval successful");
        } catch (approvalError) {
          toast.error("Approval failed");
          console.error("Approval error:", approvalError);
          return;
        }
      }

      try {
        const stakingTx = prepareContractCall({
          contract: stakeContract,
          method: "stake",
          params: [amount, days * 7n],
        });
        await sendTxAsync(
          stakingTx as PreparedTransaction<
            [],
            AbiFunction,
            PrepareTransactionOptions
          >,
        );
        toast.success("Stake successful");
      } catch (stakingError) {
        toast.error("Staking failed");
        console.error("Staking error:", stakingError);
      }
    } catch (error) {
      toast.error("Transaction failed");
      console.error("Transaction error:", error);
    }
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
                  factor={1}
                />
              </div>
            </div>
            <DrawerFooter className="flex justify-start">
              <Button
                disabled={
                  !isValid ||
                  tokensToStake === 0 ||
                  needsSwitch ||
                  lockupDuration === 0
                }
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
