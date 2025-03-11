"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConnectWalletButton from "@/components/connect-wallet-button";
import { useRouter } from "next/navigation";
import { MainNavigation } from "@/components";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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

function UnauthorizedUserStakingRewardsPage() {
  const router = useRouter();

  const handleDialogClose = () => {
    router.push("/");
  };

  return (
    <main className="min-h-screen px-[5%] pt-[10%] backdrop-blur-2xl md:px-[10%] md:pt-[3%]">
      <Dialog defaultOpen onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent className="border-gray-800 bg-blue-950/90 backdrop-blur-2xl sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-white">
              Connect Wallet to View Rewards
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <ConnectWalletButton redirectTo={`/user-stake/rewards`} />
          </div>
        </DialogContent>
      </Dialog>
      <div className="relative flex flex-col blur-sm">
        <h1 className="font-funnel flex py-8 text-center text-[32px] font-[400] leading-[36px] tracking-[-5%] md:py-4 md:text-[72px] md:leading-[72px]">
          Your Staking
        </h1>
        <div className="mt-8 grid grid-cols-2 gap-8 rounded-xl bg-[#111111] md:grid-cols-3 md:gap-12">
          <RewardBox label="$OWN Received" value="10,000" />
          <RewardBox label="Rewards Earned" value="100" />
          <RewardBox
            label="Claimable Rewards"
            value="50"
            isClaimable
            showLogo
          />
        </div>
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
      </div>
      <div className="blur-sm">
        <MainNavigation />
      </div>
    </main>
  );
}

interface RewardBoxProps {
  label: string;
  value: string | number;
  isClaimable?: boolean;
  showLogo?: boolean;
  onClaim?: () => void;
}
function RewardBox({
  label,
  value,
  isClaimable,
  onClaim,
  showLogo,
}: RewardBoxProps) {
  return (
    <div className="flex flex-col items-center space-y-2 md:items-start md:space-y-0">
      <span className="w-full text-left font-dm_mono text-[12px] uppercase leading-[12px] tracking-[8%] text-gray-400 md:text-[14px] md:leading-[14px]">
        {label}
      </span>
      <div className="flex w-full items-center gap-2 pt-4">
        {showLogo && (
          <Image
            src="/own-logo.svg"
            alt="OWN"
            width={24}
            height={24}
            className="rounded-full"
          />
        )}
        <span
          className={`text-right font-dm_sans text-[22px] font-[500] leading-[22px] tracking-[2%] text-white md:text-[32px] md:leading-[32px] ${showLogo ? "px-4 md:px-12" : ""}`}
        >
          {value}
        </span>
        {isClaimable && (
          <Button
            variant="secondary"
            onClick={onClaim}
            className="rounded-md bg-[#9333EA] px-4 py-1 pl-8 text-sm text-white transition-colors hover:bg-[#7E22CE]"
          >
            Claim
          </Button>
        )}
      </div>
    </div>
  );
}

export default UnauthorizedUserStakingRewardsPage;
