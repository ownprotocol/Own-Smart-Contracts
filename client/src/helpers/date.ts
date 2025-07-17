import { SECONDS_IN_A_DAY } from "@/constants/time";

export const getDay = (timestamp: number) => {
  // We deduct 2 days from this because weeks start on a Saturday and the first Unix timestamp started on a Thursday
  return Math.floor(timestamp / SECONDS_IN_A_DAY) - 2;
};

export const convertDaysToDate = (days: number) => {
  const date = new Date();
  const offsetMinutes = date.getTimezoneOffset();
  console.log(offsetMinutes); // e.g., -480 for UTC-8, 300 for UTC+5
  date.setSeconds(days * SECONDS_IN_A_DAY);
  return date;
};
