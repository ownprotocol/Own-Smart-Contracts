import { calculateUnlockDate } from "@/helpers";
import SummaryRow from "./summary-row";

interface StakingSummaryProps {
  tokensToStake: number;
  lockupDuration: number;
}

function StakingSummary({
  tokensToStake,
  lockupDuration,
}: StakingSummaryProps) {
  return (
    <>
      <h2 className="font-dm_sans text-[16px] font-medium leading-[24px] text-black md:text-[18px] md:leading-[28px]">
        Summary
      </h2>
      <div className="flex flex-col">
        <SummaryRow label="Token to be locked" value={tokensToStake} />
        <SummaryRow label="Factor" value="0.99x" />
        <SummaryRow
          label="Lock-up Duration"
          value={`${lockupDuration} weeks`}
        />
        <SummaryRow
          label="Unlock Date"
          value={calculateUnlockDate(lockupDuration)}
        />
      </div>
    </>
  );
}

export default StakingSummary;
