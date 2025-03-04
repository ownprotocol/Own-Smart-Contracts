import hre from "hardhat";
import { addDays } from "date-fns";

export const increaseTime = async (seconds: number) => {
  await hre.ethers.provider.send("evm_increaseTime", [seconds]);
  await hre.network.provider.request({
    method: "evm_mine",
  });
};

export const getCurrentBlockTimestamp = async () => {
  return (await hre.ethers.provider.getBlock("latest"))!.timestamp;
};

export enum DayOfWeek {
  Saturday = 0,
  Sunday = 1,
  Monday = 2,
  Tuesday = 3,
  Wednesday = 4,
  Thursday = 5,
  Friday = 6,
}

export const getDayStakingCorrected = (date: Date) => {
  // This function returns Sunday as 0, so we need to add 1 to the result
  let day = date.getUTCDay();

  day += 1;

  if (day === 7) {
    return 0;
  }

  return day;
};

export const setDayOfWeekInHardhatNode = async (dayOfWeek: DayOfWeek) => {
  const currentTime = await getCurrentBlockTimestamp();
  const currentDate = new Date(currentTime * 1000);

  const requiredDay = setNextDayOfWeekAtMidnightUTC(currentDate, dayOfWeek);

  await hre.network.provider.send("evm_setNextBlockTimestamp", [
    requiredDay.getTime() / 1000,
  ]);
  await hre.network.provider.send("evm_mine", []);
};

export const setNextDayOfWeekAtMidnightUTC = (
  date: Date,
  targetDay: number,
): Date => {
  let currentDay = getDayStakingCorrected(date);

  let daysToAdd = targetDay - currentDay;

  // This ensures we move to the next week if the target day is before the current day
  if (daysToAdd <= 0) {
    daysToAdd += 7;
  }

  const nextTargetDate = addDays(date, daysToAdd);

  return new Date(
    Date.UTC(
      nextTargetDate.getUTCFullYear(),
      nextTargetDate.getUTCMonth(),
      nextTargetDate.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );
};
