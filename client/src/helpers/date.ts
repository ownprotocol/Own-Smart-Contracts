import { SECONDS_IN_A_DAY } from "@/constants/time";

export const getDay = (timestamp: number) => {
  // We deduct 2 days from this because weeks start on a Saturday and the first Unix timestamp started on a Thursday
  return Math.floor(timestamp / SECONDS_IN_A_DAY) - 2;
};

export const convertDaysToDate = (days: number) => {
  // Instead of creating a UTC date and letting format convert it,
  // create the date directly in local time
  const date = new Date();
  date.setTime(days * SECONDS_IN_A_DAY * 1000); // Set to local time
  return date;
};
