import { ownTestingAPI } from "../helpers/testing-api";

export type OwnContract = Awaited<ReturnType<typeof ownTestingAPI>>["own"];
export type StakeContract = Awaited<ReturnType<typeof ownTestingAPI>>["stake"];
export type Signers = Awaited<ReturnType<typeof ownTestingAPI>>["signers"];
