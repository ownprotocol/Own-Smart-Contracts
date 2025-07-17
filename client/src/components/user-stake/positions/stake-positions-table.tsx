"use client";

import {
  TableHeader,
  TableRow,
} from "@/components/table/table-common-components";
import { calculateApy } from "@/helpers/calculate-apy";
import { convertDaysToDate } from "@/helpers/date";
import { displayedEthAmount } from "@/lib/display";
import { type StakingContractData, type StakingPurchaseDetails } from "@/types";
import { format } from "date-fns";
import { Check, Lock, LockOpen } from "lucide-react";

interface StakePositionsTableProps {
  stakePositions: StakingPurchaseDetails[];
  stakingContractData: StakingContractData;
}

function StakePositionsTable({
  stakePositions,
  stakingContractData,
}: StakePositionsTableProps) {
  console.log(stakePositions);
  return (
    <div className="mt-4">
      <div className="mx-auto max-w-7xl">
        <div className="py-4 md:py-6">
          <div className="px-4 md:px-6 lg:px-0">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="font-dm_mono text-[14px] font-[400] text-white md:text-[16px]">
                  Your Staking Positions
                </h1>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <h1 className="hidden font-dm_mono text-[14px] font-[400] text-gray-400 md:block md:text-[16px]">
                  View Staking Positions
                </h1>
              </div>
            </div>
            <div className="mt-1 flow-root md:mt-2">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <TableHeader>LOCK DATE</TableHeader>
                        <TableHeader>STAKED</TableHeader>
                        <TableHeader>CLAIMABLE REWARDS</TableHeader>
                        <TableHeader>APY</TableHeader>
                        <TableHeader>UNLOCK DATE</TableHeader>
                      </tr>
                    </thead>
                    {stakePositions.length === 0 ? (
                      <tbody className="divide-y divide-gray-800 font-dm_mono">
                        <tr>
                          <td colSpan={6} className="py-12 text-center">
                            No staking positions found
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody className="divide-y divide-gray-800 font-dm_mono">
                        {stakePositions.map((stakePosition, index) => (
                          <tr key={index}>
                            <TableRow>
                              {format(
                                convertDaysToDate(stakePosition.startDay),
                                "dd/MM/yyyy",
                              )}
                            </TableRow>
                            <TableRow>
                              {displayedEthAmount(stakePosition.ownAmount)} Own
                            </TableRow>
                            <TableRow>
                              {displayedEthAmount(
                                stakePosition.claimableRewards,
                                4,
                              )}{" "}
                              Own
                            </TableRow>
                            <TableRow className="text-[#F5841F]">
                              {displayedEthAmount(
                                calculateApy(
                                  stakePosition,
                                  stakingContractData.totalActiveVeOwnSupply,
                                  stakingContractData.dailyRewardAmount,
                                  stakingContractData.currentBoostMultiplier,
                                ),
                                4,
                              )}
                              %
                            </TableRow>
                            <TableRow>
                              {format(
                                convertDaysToDate(stakePosition.finalDay),
                                "dd/MM/yyyy",
                              )}
                            </TableRow>
                            <TableRow>
                              {stakePosition.status === "finished" ? (
                                <LockOpen className="h-5 w-5 rounded-full bg-slate-500 p-1 text-black" />
                              ) : stakePosition.status === "complete" ? (
                                <Check className="h-5 w-5 rounded-full bg-green-500 p-1 text-black" />
                              ) : (
                                <Lock className="h-5 w-5 rounded-full bg-white p-1 text-black" />
                              )}
                            </TableRow>
                          </tr>
                        ))}
                      </tbody>
                    )}
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
export default StakePositionsTable;
