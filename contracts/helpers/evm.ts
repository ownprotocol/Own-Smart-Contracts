import hre from "hardhat";
import { convertTimestampToRoundedDownDay } from "../constants/duration";
import { addDays, set } from "date-fns";

export const increaseTime = async (seconds: number) => {
  await hre.ethers.provider.send("evm_increaseTime", [seconds]);
  await hre.network.provider.request({
    method: "evm_mine",
  });
};

export const getCurrentBlockTimestamp = async () => {
  return (await hre.ethers.provider.getBlock("latest"))!.timestamp;
};

export const getCurrentDay = async () => {
  const currentTimestamp = await getCurrentBlockTimestamp();

  return convertTimestampToRoundedDownDay(currentTimestamp);
};

export enum DayOfWeek {
  Sunday = 1,
  Monday = 2,
  Tuesday = 3,
  Wednesday = 4,
  Thursday = 5,
  Friday = 6,
  Saturday = 7,
}

export const setDayOfWeekInHardhatNode = async (dayOfWeek: DayOfWeek) => {
  const currentTime = await getCurrentBlockTimestamp();
  const currentDate = new Date(currentTime * 1000);

  const requiredDay = setNextDayOfWeekAtMidnightUTC(currentDate, dayOfWeek);

  await hre.network.provider.send("evm_setNextBlockTimestamp", [
    requiredDay.getTime() / 1000,
  ]);
  await hre.network.provider.send("evm_mine", []);
};

const setNextDayOfWeekAtMidnightUTC = (date: Date, targetDay: number): Date => {
  const currentDay = date.getUTCDay();

  let daysToAdd = targetDay - currentDay;

  // If the target day is earlier in the week, move to next week
  if (daysToAdd <= 0) {
    daysToAdd += 7; // Move to next week
  }

  const nextTargetDate = addDays(date, daysToAdd);

  return set(nextTargetDate, {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
};
