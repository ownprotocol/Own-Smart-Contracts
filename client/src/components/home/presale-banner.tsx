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
    <div className="relative min-h-[200px] w-full">
      {/* Glow effect */}
      <div className="absolute inset-0 h-[580px] w-[100px] rotate-[24.3deg] rounded-full bg-[#E49048] opacity-10 blur-[200px]" />

      <div className="flex flex-col items-center gap-4 md:flex-row">
        <h1 className="header !pb-0 !text-left">
          Buy $Own Token in Presale Now
        </h1>
        <div className="flex w-full justify-end md:w-1/4 md:self-end">
          {roundId !== null && (
            <span>
              {soldout ? <SoldOutBadge /> : <LiveBadge />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
const LiveBadge = () => (
  <div className="flex items-center gap-2 rounded-full bg-green-600 px-3 py-2">
    <div className="h-4 w-4 rounded-full bg-green-400"></div>
    <span className="text-sm font-medium uppercase tracking-wider text-green-200/80">
      LIVE
    </span>
  </div>
);

const SoldOutBadge = () => (
  <span className="rounded-full bg-[#C1691180] px-4 py-1.5 pt-2 font-fun text-sm uppercase tracking-wider text-[#F1AF6E] md:text-xs">
    SOLD OUT
  </span>
);
export default PresaleBanner;
