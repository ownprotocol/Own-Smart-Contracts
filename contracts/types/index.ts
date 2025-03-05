import { getContractInstances } from "../helpers/testing-api";

export type OwnContract = Awaited<
  ReturnType<typeof getContractInstances>
>["own"];
export type StakeContract = Awaited<
  ReturnType<typeof getContractInstances>
>["stake"];
export type Signers = Awaited<
  ReturnType<typeof getContractInstances>
>["signers"];
export type VeOwn = Awaited<ReturnType<typeof getContractInstances>>["veOwn"];
export type PresaleContract = Awaited<
  ReturnType<typeof getContractInstances>
>["presale"];
export type MockUSDTContract = Awaited<
  ReturnType<typeof getContractInstances>
>["mockUSDT"];
export type MockSablierContract = Awaited<
  ReturnType<typeof getContractInstances>
>["mockSablierLockup"];
