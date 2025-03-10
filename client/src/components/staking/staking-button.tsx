interface StakingButtonProps {
    label: string;
    isSelected?: boolean;
    onClick?: () => void;
    isLoading?: boolean;
  }
  
  const StakingButton = ({
    label,
    isSelected = false,
    onClick,
    isLoading,
  }: StakingButtonProps) => {
    return (
      <button
        disabled={isLoading}
        type="button"
        onClick={onClick}
        className={`rounded-full px-4 py-2 font-dm_sans text-[12px] font-medium leading-[24px] transition-colors md:px-8 md:text-[18px] md:leading-[28px] ${
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