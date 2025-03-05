import { ownTestingAPI } from "../helpers/testing-api";
import { StakeContract } from "../types";
import {
  DayOfWeek,
  getCurrentBlockTimestamp,
  getDayStakingCorrected,
  setDayOfWeekInHardhatNode,
} from "../helpers/evm";
import { expect } from "chai";

describe("Helpers", async () => {
  let stake: StakeContract;

  before(async () => {
    ({ stake } = await ownTestingAPI());
  });

  it("Should update the current day to wednesday", async () => {
    const desiredDay = DayOfWeek.Wednesday;

    await setDayOfWeekInHardhatNode(desiredDay);

    const newTime = await getCurrentBlockTimestamp();

    const newDate = new Date(newTime * 1000);
    const newDayOfWeek = getDayStakingCorrected(newDate);

    expect(newDayOfWeek).to.equal(desiredDay);
  });

  it("Should update the current day to saturday", async () => {
    const desiredDay = DayOfWeek.Saturday;

    await setDayOfWeekInHardhatNode(desiredDay);

    const newTime = await getCurrentBlockTimestamp();

    const newDate = new Date(newTime * 1000);
    const newDayOfWeek = getDayStakingCorrected(newDate);

    expect(newDayOfWeek).to.equal(desiredDay);
  });

  it("Should have the correct days since staking started", async () => {
    const desiredDay = DayOfWeek.Wednesday;

    await setDayOfWeekInHardhatNode(desiredDay);

    const updatedDay = Number(await stake.read.getCurrentDay());

    const startWeek = Math.floor(updatedDay / 7);
    const firstDayOfStartWeek = startWeek * 7;

    expect(updatedDay - firstDayOfStartWeek).to.equal(DayOfWeek.Wednesday);
  });

  it("Should go to the next staking week", async () => {
    const desiredDay = DayOfWeek.Saturday;

    const beforeWeek = Number(await stake.read.getCurrentWeek());

    await setDayOfWeekInHardhatNode(desiredDay);

    const updatedWeek = Number(await stake.read.getCurrentWeek());

    const updatedDay = Number(await stake.read.getCurrentDay());

    expect(updatedWeek - beforeWeek).to.equal(1);

    expect(updatedDay % 7).to.equal(0);
  });
});
