"use client";

import StakingDrawerHeader from "./staking-drawer-header";
import Staking from "./staking";
import { StakingConfirmation, StakingLoadingState } from "@/components";
import { useState } from "react";
import { useContracts } from "@/hooks";
import { useForm } from "react-hook-form";
import { type StakingFormData, stakingSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { parseEther } from "viem";
import { allowance } from "thirdweb/extensions/erc20";
import { toast } from "react-toastify";
import { type CurrentPresaleRoundDetails } from "@/types/presale";

interface StakingDrawerContentProps {
  ownBalance: number;
  presaleAllocation: CurrentPresaleRoundDetails["roundDetails"]["allocation"];
  preSaleSold: CurrentPresaleRoundDetails["roundDetails"]["sales"];
  setIsOpen: (isOpen: boolean) => void;
}

type StakingState = "setup" | "awaiting" | "confirmed";

const StakingDrawerContent = ({
  ownBalance,
  setIsOpen,
  presaleAllocation,
  preSaleSold,
}: StakingDrawerContentProps) => {
  const activeAccount = useActiveAccount();
  const [stakingState, setStakingState] = useState<StakingState>("setup");
  const { stakeContract, ownTokenContract } = useContracts();

  const allocation = presaleAllocation ?? 0;
  const maxAllocation = allocation - preSaleSold;

  const {
    register,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<StakingFormData>({
    resolver: zodResolver(stakingSchema(maxAllocation)),
    defaultValues: {
      tokenAmount: 0,
      lockupDurationWeeks: 1,
    },
  });

  const onSubmit = async () => {
    if (!activeAccount) {
      console.error("No active account");
      return;
    }

    const data = getValues();
    const { tokenAmount, lockupDurationWeeks } = data;

    if (tokenAmount > maxAllocation) {
      toast.error(
        `Not enough allocation. Maximum allocation is ${maxAllocation}`,
      );
      setValue("tokenAmount", maxAllocation);
      await trigger(["tokenAmount"], { shouldFocus: true });

      return;
    }

    setStakingState("awaiting");

    try {
      const amount = parseEther(tokenAmount.toString());
      const days = BigInt(lockupDurationWeeks);

      const allowanceBalance = await allowance({
        contract: ownTokenContract,
        owner: activeAccount?.address ?? "",
        spender: stakeContract.address,
      });

      // check if approval is needed
      if (allowanceBalance < amount) {
        await sendAndConfirmTransaction({
          account: activeAccount,
          transaction: prepareContractCall({
            contract: ownTokenContract,
            method: "approve",
            params: [stakeContract.address, amount],
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

      setStakingState("confirmed");

      toast.success("Transaction successful");
    } catch (error) {
      toast.error("Transaction failed");
      console.error("Transaction error:", error);

      setStakingState("setup");
    }
  };

  const { tokenAmount, lockupDurationWeeks } = getValues();

  return (
    <div className="mx-auto w-full px-[0%] pt-0 md:px-[5%] md:pt-8">
      {stakingState === "setup" && (
        <>
          <StakingDrawerHeader ownBalance={ownBalance} />
          <Staking
            ownBalance={ownBalance}
            setValue={setValue}
            errors={errors}
            register={register}
            onClick={onSubmit}
            values={{ tokenAmount, lockupDurationWeeks }}
            goToNextStep={() => setStakingState("awaiting")}
          />
        </>
      )}
      {stakingState === "awaiting" && (
        <StakingLoadingState
          tokensToStake={tokenAmount}
          lockupDuration={lockupDurationWeeks}
        />
      )}

      {stakingState === "confirmed" && (
        <StakingConfirmation
          tokensToStake={tokenAmount}
          lockupDuration={lockupDurationWeeks}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
};

export default StakingDrawerContent;
