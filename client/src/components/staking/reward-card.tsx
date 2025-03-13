import Image from "next/image";

interface RewardCardProps {
  tokensToStake: number;
  lockupDuration: number;
  factor: number;
  ownTokenSymbol?: string;
}

const RewardCard = ({
  tokensToStake,
  lockupDuration,
  factor,
}: RewardCardProps) => {
  const totalOwnRewards = tokensToStake * factor * lockupDuration;
  return (
    <div className="">
      <h2 className="px-0 font-dm_sans text-[16px] font-medium leading-[24px] text-black md:px-0 md:text-[18px] md:leading-[28px]">
        My veOwn
      </h2>
      <div className="flex flex-col gap-4 rounded-lg bg-purple-100 px-4 py-4 xl:mt-2 xl:py-8">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white/80 px-2 py-2">
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
              {Number(totalOwnRewards).toLocaleString()}
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

export default RewardCard;
