"use client";

interface RewardBoxProps {
  label: string;
  value: string | number;
  className?: string;
}

function RewardBox({ label, value, className }: RewardBoxProps) {
  return (
    <div className={`flex flex-col items-center space-y-1 md:items-start md:space-y-0 rounded-2xl p-4 ${className}`}>
      <h2 className="w-full text-left font-dm_mono text-[12px] uppercase leading-[12px] tracking-[8%] text-gray-400 md:text-[14px] md:leading-[14px]">
      {label}
      </h2>
      <div className="flex w-full items-center gap-2 pt-2 md:pt-4">
        <p
          className={`text-right font-dm_sans text-[22px] font-[500] leading-[22px] tracking-[2%] text-white md:text-[32px] md:leading-[32px] pt-2`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default RewardBox;
