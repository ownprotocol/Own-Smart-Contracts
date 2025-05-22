export const SECONDS_IN_A_HOUR = 3600;
export const SECONDS_IN_A_DAY = 86400;
export const SECONDS_IN_A_WEEK = 604800;

export const convertTimestampToRoundedDownDay = (timestamp: number) => {
  return Math.floor(timestamp / SECONDS_IN_A_DAY);
};
