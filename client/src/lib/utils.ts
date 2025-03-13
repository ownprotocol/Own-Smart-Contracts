import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stakeRewards = [
  {
    id: 1,
    own_locked: "1000",
    start_date: "2024-01-01",
    end_date: "2024-01-01",
    rewards: "100",
    own_in_dollars: "1000",
  },
  {
    id: 2,
    own_locked: "1000",
    start_date: "2024-01-01",
    end_date: "2024-01-01",
    rewards: "100",
    own_in_dollars: "1000",
  },

  {
    id: 3,
    own_locked: "1000",
    start_date: "2024-01-01",
    end_date: "2024-01-01",
    rewards: "100",
    own_in_dollars: "1000",
  },
];
