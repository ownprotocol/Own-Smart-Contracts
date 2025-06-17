interface StakingButtonProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const StakingButton = ({
  label,
  isSelected = false,
  onClick,
}: StakingButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-fit rounded-full px-2 py-1 font-dm_sans text-[12px] font-medium leading-[24px] transition-colors md:px-8 md:py-2 md:text-[18px] md:leading-[28px] ${
        isSelected
          ? "bg-purple-700 text-white hover:bg-purple-800"
          : "bg-purple-100 text-purple-900 hover:bg-purple-200"
      }`}
    >
      {label}
    </button>
  );
};

export default StakingButton;

