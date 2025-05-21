interface StakeOwnTokenBannerProps {
  percentage: number;
}

function StakeOwnTokenBanner({ percentage }: StakeOwnTokenBannerProps) {
  return (
    <div className="container mx-auto">
      <div className="flex w-full flex-col items-center justify-center">
        <p className="text-left font-['DM_Sans'] text-[16px] font-[400] leading-[24px] text-[#B4B4B4] md:text-center md:text-[32px] md:leading-[42px]">
          Boost your rewards by staking your $Own Tokens,and earn up to{" "}
          {percentage * 100}% increase.
        </p>
      </div>
    </div>
  );
}

export default StakeOwnTokenBanner;
