"use client";

import {
  useActiveAccount,
  useSendAndConfirmTransaction,
  useSendTransaction,
} from "thirdweb/react";
import { type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  prepareContractCall,
  sendAndConfirmTransaction,
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
import { allowance } from "thirdweb/extensions/erc20";
import { useContractAddresses } from "@/hooks/use-contract-addresses";

interface StakingProps {
  ownBalance: string;
  ownTokenSymbol?: string;
  needsSwitch: boolean;
  tokensToStake: number;
  lockupDuration: number;
  setTokensToStake: Dispatch<SetStateAction<number>>;
  setLockupDuration: Dispatch<SetStateAction<number>>;
  setIsStakingLoading: Dispatch<SetStateAction<boolean>>;
  setConfirmStaking: Dispatch<SetStateAction<boolean>>;
}

function Staking({
  ownBalance,
  needsSwitch,
  tokensToStake,
  lockupDuration,
  setTokensToStake,
  setLockupDuration,
  setIsStakingLoading,
  setConfirmStaking,
}: StakingProps) {
  const { isValid } = useGetAuthUser();
  const activeAccount = useActiveAccount();
  const { stakeContract, ownTokenContract } = useContracts();

  const { stakeAddress } = useContractAddresses();

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
    if (!activeAccount) {
      console.error("No active account");
      return;
    }

    setIsStakingLoading(true);
    try {
      const amount = toWei(data.tokenAmount);
      const days = BigInt(data.lockupDuration);

      const allowanceBalance = await allowance({
        contract: ownTokenContract,
        owner: activeAccount?.address ?? "",
        spender: stakeAddress,
      });

      // check if approval is needed
      if (allowanceBalance < amount) {
        await sendAndConfirmTransaction({
          account: activeAccount,
          transaction: prepareContractCall({
            contract: ownTokenContract,
            method: "approve",
            params: [stakeAddress, amount],
          }),
        });

        toast.success("Approval successful");
      }

      await sendAndConfirmTransaction({
        account: activeAccount,
        transaction: prepareContractCall({
          contract: stakeContract,
          method: "stake",
          params: [amount, days * 7n],
        }),
      });
    } catch (error) {
      toast.error("Transaction failed");
      console.error("Transaction error:", error);
    } finally {
      setIsStakingLoading(false);
      setConfirmStaking(true);
    }
  };

  return (
    <div className="px-4 py-2">
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
    </div>
  );
}

export default Staking;
