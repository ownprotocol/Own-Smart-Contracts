"use client";

import StakingDrawerHeader from "./staking-drawer-header";
import Staking from "./staking";
import { StakingConfirmation, StakingLoadingState } from "@/components";
import { useState } from "react";
import { useContracts } from "@/hooks";
import { useForm } from "react-hook-form";
import { type StakingFormData, createStakingSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { parseEther } from "viem";
import { allowance } from "thirdweb/extensions/erc20";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface StakingDrawerContentProps {
  ownBalance: number;
  timestamp: number;
  setIsOpen: (isOpen: boolean) => void;
}

type StakingState = "setup" | "awaiting" | "confirmed";

const StakingDrawerContent = ({
  ownBalance,
  timestamp,
  setIsOpen,
}: StakingDrawerContentProps) => {
  const router = useRouter();
  const activeAccount = useActiveAccount();

  const [stakingState, setStakingState] = useState<StakingState>("setup");
  const { stakeContract, ownTokenContract } = useContracts();

  const {
    register,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<StakingFormData>({
    resolver: zodResolver(createStakingSchema(ownBalance)),
    mode: "onChange",
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

    setStakingState("awaiting");

    const data = getValues();

    try {
      const amount = parseEther(data.tokenAmount.toString());
      const days = BigInt(data.lockupDurationWeeks);

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
      setTimeout(() => {
        setIsOpen(false);
        router.push("/positions");
      }, 1000);
    } catch (error) {
      toast.error("Transaction failed");
      console.error("Transaction error:", error);

      setStakingState("setup");
    }
  };

  const { tokenAmount, lockupDurationWeeks } = getValues();

  return (
    <div className="mx-auto w-full bg-white">
      {stakingState === "setup" && (
        <>
          <StakingDrawerHeader ownBalance={ownBalance} />
          <Staking
            ownBalance={ownBalance}
            isValid={isValid}
            timestamp={timestamp}
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
          timestamp={timestamp}
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
