interface StakeOwnTokenBannerProps {
  percentage: number;
}

function StakeOwnTokenBanner({ percentage }: StakeOwnTokenBannerProps) {
  return (
    <div className="container mx-auto">
      <div className="mx-auto flex w-full flex-col items-center justify-center md:w-[75%]">
        <p className="px-8 text-left font-['DM_Sans'] text-[16px] font-[400] leading-[24px] text-[#B4B4B4] md:px-0 md:text-center md:text-[32px] md:leading-[42px]">
          Boost your rewards by staking your $Own Tokens,and earn up to{" "}
          {percentage * 100}% increase.
        </p>
      </div>
    </div>
  );
}

export default StakeOwnTokenBanner;
