import { addWeeks, format } from "date-fns";

export  const calculateUnlockDate = (durationInWeeks: number): string => {
    if (!durationInWeeks || durationInWeeks <= 0) return "N/A";

    const currentDate = new Date();
    const unlockDate = addWeeks(currentDate, durationInWeeks);
    return format(unlockDate, "MMM d yyyy HH:mm");
  };