
interface SummaryRowProps {
    label: string;
    tokenValue?: string | number;
    factorValue?: string | number;
    lockupDuration?: string | number;
    unlockDate?: string;
  }
  
  const SummaryRow = ({ label, tokenValue, factorValue, lockupDuration, unlockDate }: SummaryRowProps) => (
    <div className="flex justify-between py-1 md:py-2">
      <span className="font-dm_sans text-[14px] leading-[20px] text-gray-500 md:text-[16px] md:leading-[24px]">
        {label}
      </span>
      {tokenValue && (  
        <span className="font-dm_sans text-[14px] leading-[20px] text-black md:text-[16px] md:leading-[24px]">
          {tokenValue}
        </span>
      )}
      {factorValue && (
        <span className="font-dm_sans text-[14px] leading-[20px] text-black md:text-[16px] md:leading-[24px]">
          {factorValue}
        </span>
      )}
      {lockupDuration && (
        <span className="font-dm_sans text-[14px] leading-[20px] text-black md:text-[16px] md:leading-[24px]">
          {lockupDuration}
        </span>
      )}
      {unlockDate && (
        <span className="font-dm_sans text-[14px] leading-[20px] text-black md:text-[16px] md:leading-[24px]">
          {unlockDate}
        </span>
      )}
    </div>
  );

export default SummaryRow;