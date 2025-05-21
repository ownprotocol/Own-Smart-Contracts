interface PresaleBannerProps {
  roundId: number | null;
  presaleAllocation: number;
  preSaleSold: number;
}

function PresaleBanner({
  roundId,
  presaleAllocation,
  preSaleSold,
}: PresaleBannerProps) {
  const soldout = presaleAllocation === preSaleSold;
  return (
    <div className="relative min-h-[200px]">
      {/* Glow effect */}
      <div className="absolute inset-0 h-[580px] w-[100px] rotate-[24.3deg] rounded-full bg-[#E49048] opacity-10 blur-[200px]" />

      <div className="flex flex-col items-center gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="header">Buy $Own Token in Presale Now</h1>
        <div className="flex w-full justify-start md:w-1/4 md:justify-end">
          {roundId !== null && (
            <span className="rounded-full bg-[#C1691180] px-4 py-1.5 pt-2 font-fun text-sm uppercase tracking-wider text-[#F1AF6E] md:text-xs">
              {soldout ? "Sold Out" : `Phase ${roundId + 1}`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default PresaleBanner;
