import { OWN_MAX_SUPPLY_WITH_DECIMALS } from "../constants";
import { ownTestingAPI } from "../helpers/testing-api";
import { OwnContract } from "../types";
import { expect } from "chai";

describe("OWN token testing", async () => {
  let own: OwnContract;

  before(async () => {
    ({ own } = await ownTestingAPI());
  });

  it("should have 450 million minted on creation", async () => {
    const totalSupply = await own.read.totalSupply();

    expect(totalSupply).equal(OWN_MAX_SUPPLY_WITH_DECIMALS);
  });
});
