import { addWeeks, format } from "date-fns";

/**
 * Calculates and formats the unlock date for a staking position
 * @param timestamp Unix timestamp (in seconds) representing when the staking started
 * @param durationInWeeks Duration of the staking period in weeks
 * @returns Formatted unlock date string in "MMM d yyyy HH:mm" format, or "N/A" if duration is invalid
 */
export const calculateUnlockDate = (
  timestamp: number,
  durationInWeeks: number,
): string => {
  if (!durationInWeeks || durationInWeeks <= 0) return "N/A";

  const currentDate = new Date(timestamp * 1000);
  const unlockDate = addWeeks(currentDate, durationInWeeks);
  return format(unlockDate, "MMM d yyyy HH:mm");
};

