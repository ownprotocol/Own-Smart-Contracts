import { expect } from "chai";
import { OwnContract, PresaleContract } from "../../types";
import { ownTestingAPI } from "../../helpers/testing-api";

describe("Presale - update presale round", async () => {
  let presale: PresaleContract;
  let own: OwnContract;

  const ALLOCATION = BigInt(1000);

  before(async () => {
    ({ presale, own } = await ownTestingAPI());
  });

  beforeEach(async () => {
    own.write.transfer([presale.address, ALLOCATION]);

    await presale.write.addPresaleRounds([
      [
        {
          duration: BigInt(100000),
          price: BigInt(1),
          allocation: ALLOCATION,
          sales: BigInt(0),
        },
      ],
    ]);
  });

  describe("updatePresaleRoundDuration", async () => {});
});
