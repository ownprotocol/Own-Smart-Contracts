import { SECONDS_IN_A_DAY } from "@/constants/time";

// The staking contract handles weeks by deducting 2 days, so that weeks start from the first UNIX saturday
export const convertStakeWeekToUnixTime = (week: number) => {
  const day = week * 7 + 2;
  return day * SECONDS_IN_A_DAY;
};
