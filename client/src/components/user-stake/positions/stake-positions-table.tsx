"use client";

import {
  TableHeader,
  TableRow,
} from "@/components/table/table-common-components";
import { type StakingPurchaseDetails } from "@/types";

const stakePosition = [
  {
    id: 1,
    date: "2024-01-01",
    own_locked: "1000",
    rewards: "100",
    apr: "10",
  },
  {
    id: 2,
    date: "2024-01-01",
    own_locked: "1000",
    rewards: "100",
    apr: "10",
  },

  {
    id: 3,
    date: "2024-01-01",
    own_locked: "1000",
    rewards: "100",
    apr: "10",
  },
];

interface StakePositionsTableProps {
  stakePositions: StakingPurchaseDetails[];
}

function StakePositionsTable({ stakePositions }: StakePositionsTableProps) {
  return (
    <div className="mt-4">
      <div className="mx-auto max-w-7xl">
        <div className="py-10">
          <div className="px-4 md:px-6 lg:px-0">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="font-dm_mono text-[14px] font-[400] text-white md:text-[16px]">
                  Your Staking Positions
                </h1>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <h1 className="font-dm_mono text-[14px] font-[400] text-gray-400 md:text-[16px]">
                  View Staking Positions
                </h1>
              </div>
            </div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        {/* <th
                          scope="col"
                          className="px-3 py-3.5 text-left font-dm_mono text-sm font-semibold text-gray-400 sm:pl-0"
                        >
                          DATE
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left font-dm_mono text-sm font-semibold text-gray-400 sm:pl-0"
                        >
                          OWN LOCKED
                        </th>

                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left font-dm_mono text-sm font-semibold text-gray-400 sm:pl-0"
                        >
                          REWARDS
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left font-dm_mono text-sm font-semibold text-gray-400 sm:pl-0"
                        >
                          APR
                        </th> */}
                        <TableHeader>DATE</TableHeader>
                        <TableHeader>OWN LOCKED</TableHeader>
                        <TableHeader>REWARDS</TableHeader>
                        <TableHeader>APR</TableHeader>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 font-dm_mono">
                      {stakePositions.map((stakePosition, index) => (
                        <tr key={index}>
                          <TableRow>{daysToDate(stakePosition.startDay)}</TableRow>
                          <TableRow>
                            {stakePosition.ownAmount.toLocaleString("en-US")}{" "}
                            Own
                          </TableRow>
                          <TableRow>
                            {stakePosition.veOwnAmount.toLocaleString("en-US")}{" "}
                            Own
                          </TableRow>
                          <TableRow className="text-[#F5841F]">
-
                          </TableRow>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function daysToDate(days: number) {
  const milliseconds = days * 86400000;
  const date = new Date(milliseconds);
  return date.toLocaleDateString();
}

export default StakePositionsTable;
