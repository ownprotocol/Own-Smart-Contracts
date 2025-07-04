"use client";

import {
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue,
} from "react-hook-form";
import { Button } from "../ui/button";
import { DrawerFooter } from "../ui/drawer";
import RewardCard from "./reward-card";
import { type StakingFormData } from "@/types/staking";
import StakingLockupPeriod from "./staking-lockup-period";
import StakingTokens from "./staking-tokens";
import StakingSummary from "./staking-summary";

interface StakingProps {
  ownBalance: number;
  timestamp: number;
  isValid: boolean;
  values: StakingFormData;
  register: UseFormRegister<StakingFormData>;
  setValue: UseFormSetValue<StakingFormData>;
  errors: FieldErrors<StakingFormData>;
  goToNextStep: () => void;
  onClick: () => Promise<void>;
}

function Staking({
  ownBalance,
  timestamp,
  errors,
  isValid,
  values: { tokenAmount, lockupDurationWeeks },
  register,
  setValue,
  onClick,
}: StakingProps) {
  return (
    <div className="px-4 py-2">
      <form>
        <div className="flex flex-col gap-0 md:gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <StakingTokens
              title="Enter TOKENS TO STAKE"
              register={register}
              setValue={setValue}
              errors={errors}
              ownBalance={Number(ownBalance ?? 0)}
            />

            <StakingLockupPeriod
              title="LOCK UP PERIOD"
              lockupDuration={lockupDurationWeeks}
              register={register}
              setValue={setValue}
              errors={errors}
            />
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:gap-4">
            <div className="flex w-full flex-col gap-2">
              <div className="w-full rounded-lg px-0 md:px-4">
                <StakingSummary
                  tokensToStake={tokenAmount}
                  lockupDuration={lockupDurationWeeks}
                  timestamp={timestamp}
                />
              </div>
              <div className="w-full"></div>
            </div>
            <div className="w-full">
              <RewardCard
                tokensToStake={tokenAmount}
                lockupDuration={lockupDurationWeeks}
                factor={1}
              />
            </div>
          </div>
          <DrawerFooter className="flex justify-start !px-0">
            <Button
              disabled={
                tokenAmount === 0 || lockupDurationWeeks === 0 || !isValid
              }
              variant="mainButton"
              className="max-w-32"
              size="lg"
              onClick={onClick}
              useSpinner
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
