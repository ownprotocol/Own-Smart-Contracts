import clsx from "clsx";

interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionLabel = ({ children, className }: LabelProps) => {
  return (
    <h1
      className={clsx(
        "font-dm_mono text-[12px] font-[400] leading-[14px] tracking-[8%] text-gray-500 md:text-[14px] md:leading-[16px]",
        className,
      )}
    >
      {children}
    </h1>
  );
};
