import Image from "next/image";
import { calculateUnlockDate } from "@/helpers";
import { displayedEthAmount } from "@/lib/display";

interface StakingLoadingStateProps {
  tokensToStake: number;
  lockupDuration: number;
  timestamp: number;
}

const StakingLoadingState = ({
  tokensToStake,
  lockupDuration,
  timestamp,
}: StakingLoadingStateProps) => {
  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-4 text-center">
      <div className="relative mb-8 max-w-[250px]">
        <Image
          src="/staking-loading.png"
          alt="Staking in progress"
          width={250}
          height={250}
          className="animate-pulse"
        />
      </div>

      <div>
        <h2 className="align-middle font-dm_sans text-[14px] font-normal leading-[14px] tracking-[0%] text-gray-500 text-primary md:text-[20px] md:leading-[16px]">
          Waiting for Confirmation
        </h2>
        <div className="flex items-center justify-center gap-2 pt-8 text-primary">
          <div className="h-10 w-10 rounded-full border-2 border-gray-500 px-1 py-3.5 text-gray-500 opacity-50">
            <Image
              src="/own-logo.svg"
              alt="Own token"
              width={30}
              height={30}
              className="text-primary invert"
            />
          </div>
          <span className="font-dm_sans text-[32px] font-normal leading-[32px] tracking-[0.5%] md:text-[48px] md:leading-[48px]">
            {displayedEthAmount(tokensToStake)}
          </span>
        </div>
        <p className="pt-4 align-middle font-dm_mono text-[12px] uppercase leading-[100%] tracking-[8%] text-gray-500 md:text-[14px]">
          LOCKED TILL {calculateUnlockDate(timestamp, lockupDuration)}
        </p>
      </div>
    </div>
  );
};

export default StakingLoadingState;
