import { SECONDS_IN_A_DAY } from "@/constants/time";

export const getDay = (timestamp: number) => {
  // We deduct 2 days from this because weeks start on a Saturday and the first Unix timestamp started on a Thursday
  return Math.floor(timestamp / SECONDS_IN_A_DAY) - 2;
};

export const convertDaysToDate = (days: number) => {
  const date = new Date(0);
  date.setUTCSeconds((days + 2) * SECONDS_IN_A_DAY);

  return date;
};