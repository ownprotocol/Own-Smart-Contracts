import { ownTestingAPI } from "../helpers/testing-api";

export type OwnContract = Awaited<ReturnType<typeof ownTestingAPI>>["own"];
export type StakeContract = Awaited<ReturnType<typeof ownTestingAPI>>["stake"];
export type Signers = Awaited<ReturnType<typeof ownTestingAPI>>["signers"];
export type VeOWN = Awaited<ReturnType<typeof ownTestingAPI>>["veOwn"];
export type PresaleContract = Awaited<
  ReturnType<typeof ownTestingAPI>
>["presale"];
export type MockUSDTContract = Awaited<
  ReturnType<typeof ownTestingAPI>
>["mockUSDT"];
export type MockSablierContract = Awaited<
  ReturnType<typeof ownTestingAPI>
>["mockSablierLockup"];
