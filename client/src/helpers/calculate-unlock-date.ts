import { addWeeks, format } from "date-fns";

export const calculateUnlockDate = (
  timestamp: number,
  durationInWeeks: number,
): string => {
  if (!durationInWeeks || durationInWeeks <= 0) return "N/A";

  const currentDate = new Date(timestamp * 1000);
  const unlockDate = addWeeks(currentDate, durationInWeeks);
  return format(unlockDate, "MMM d yyyy HH:mm");
};

