import { expect } from "chai";
import { OWN_MAX_SUPPLY_WITH_DECIMALS } from "../constants";
import { ownTestingAPI } from "../helpers/testing-api";
import { OwnContract } from "../types";

describe("OWN token testing", async () => {
  let own: OwnContract;

  before(async () => {
    ({ own } = await ownTestingAPI());
  });

  it("should have the correct max supply minted on deployment", async () => {
    const totalSupply = await own.read.totalSupply();

    expect(totalSupply).equal(OWN_MAX_SUPPLY_WITH_DECIMALS);
  });
});
