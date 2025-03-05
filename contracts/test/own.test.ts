import { expect } from "chai";
import { OWN_MAX_SUPPLY_WITH_DECIMALS } from "../constants";
import { getContractInstances } from "../helpers/testing-api";
import { OwnContract } from "../types";

describe("Own token testing", async () => {
  let own: OwnContract;

  before(async () => {
    ({ own } = await getContractInstances());
  });

  it("should have the correct max supply minted on deployment", async () => {
    const totalSupply = await own.read.totalSupply();

    expect(totalSupply).equal(OWN_MAX_SUPPLY_WITH_DECIMALS);
  });
});
