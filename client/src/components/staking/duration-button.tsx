interface DurationButtonProps {
  duration: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const DurationButton = ({
  duration,
  isSelected = false,
  onClick,
}: DurationButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-fit w-fit rounded-full px-4 py-2 font-dm_sans text-[12px] font-medium leading-[24px] transition-colors md:text-[18px] md:leading-[28px] ${
        isSelected
          ? "bg-purple-700 text-white hover:bg-purple-800"
          : "bg-purple-100 text-purple-900 hover:bg-purple-200"
      }`}
    >
      <span>{duration}</span>
    </button>
  );
};

export default DurationButton;
