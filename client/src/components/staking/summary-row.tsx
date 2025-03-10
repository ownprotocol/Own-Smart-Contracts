
interface SummaryRowProps {
    label: string;
    value: string | number;
  }
  
  const SummaryRow = ({ label, value }: SummaryRowProps) => (
    <div className="flex justify-between py-1 md:py-2">
      <span className="font-dm_sans text-[14px] leading-[20px] text-gray-500 md:text-[16px] md:leading-[24px]">
        {label}
      </span>
      <span className="font-dm_sans text-[14px] leading-[20px] text-black md:text-[16px] md:leading-[24px]">
        {value}
      </span>
    </div>
  );

export default SummaryRow;