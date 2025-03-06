export const SECONDS_IN_A_DAY = 86400;

export const convertTimestampToRoundedDownDay = (timestamp: number) => {
  return Math.floor(timestamp / SECONDS_IN_A_DAY);
};
