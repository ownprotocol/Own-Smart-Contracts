"use client";

import { Button } from "@/components/ui/button";

const stakeRewards = [
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

function StakeRewardsTable() {
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
                  View Reward History
                </h1>
              </div>
            </div>
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
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
                          START DATE
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left font-dm_mono text-sm font-semibold text-gray-400 sm:pl-0"
                        >
                          END DATE
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left font-dm_mono text-sm font-semibold text-gray-400 sm:pl-0"
                        >
                          REWARDS
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                        >
                          <span className="sr-only">Withdraw</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {stakeRewards.map((stakeReward) => (
                        <tr key={stakeReward.id}>
                          <td className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left font-dm_sans text-sm font-semibold text-white sm:pl-0">
                            {stakeReward.own_locked} Own
                            <p className="font-dm_sans text-[8px] font-[400] leading-[14px] tracking-[-3%] text-gray-400 md:text-[12px] md:leading-[16px]">
                              ={stakeReward.own_in_dollars}
                            </p>
                          </td>
                          <td className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left font-dm_sans text-sm font-semibold text-white sm:pl-0">
                            {stakeReward.start_date}
                          </td>
                          <td className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left font-dm_sans text-sm font-semibold text-white sm:pl-0">
                            {stakeReward.end_date}
                          </td>
                          <td className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left font-dm_sans text-sm font-semibold text-[#F5841F] sm:pl-0">
                            {stakeReward.rewards}
                          </td>
                          <td className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left font-dm_sans text-sm font-semibold text-white sm:pl-0">
                            <Button
                              variant="ghost"
                              className="text-[#B37FE8] hover:text-[#B37FE8]"
                              //TODO: Implement withdraw logic here
                              onClick={() => {
                                console.log("Withdraw");
                              }}
                            >
                              Withdraw
                              <span className="sr-only">
                                {" "}
                                {stakeReward.own_locked}
                              </span>
                            </Button>
                          </td>
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

export default StakeRewardsTable;
