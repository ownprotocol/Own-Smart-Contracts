import { ownTestingAPI } from "../helpers/testing-api";
import { StakeContract } from "../types";
import {
  DayOfWeek,
  getCurrentBlockTimestamp,
  setDayOfWeekInHardhatNode,
} from "../helpers/evm";
import { expect } from "chai";
import { getDay } from "date-fns";

describe.only("Helpers", async () => {
  let stake: StakeContract;

  before(async () => {
    ({ stake } = await ownTestingAPI());
  });

  it("Should update the current day to wednesday", async () => {
    const desiredDay = DayOfWeek.Wednesday;

    await setDayOfWeekInHardhatNode(desiredDay);

    const newTime = await getCurrentBlockTimestamp();

    const newDate = new Date(newTime * 1000);
    const newDayOfWeek = getDay(newDate);

    expect(newDayOfWeek).to.equal(desiredDay);
  });

  // it("Should update the current day to saturday", async () => {
  //   const desiredDay = DayOfWeek.Saturday;
  //
  //   await setDayOfWeekInHardhatNode(desiredDay);
  //
  //   const newTime = await getCurrentBlockTimestamp();
  //
  //   const newDate = new Date(newTime * 1000);
  //   const newDayOfWeek = getDay(newDate);
  //
  //   expect(newDayOfWeek).to.equal(desiredDay);
  // });
});
