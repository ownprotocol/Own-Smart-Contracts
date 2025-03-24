"use client";

import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";

import {
  BlurredStakingBoard,
  ConnectWalletButton,
  MainNavigation,
} from "@/components";
import { StakePageContent } from "@/components/user-stake/stake-page-content";
import { DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";

function UserStakingPositionsPage() {
  const router = useRouter();
  const activeAccount = useActiveAccount();

  const handleDialogClose = () => {
    router.push("/");
  };
  if (!activeAccount?.address) {
    return (
      <main className="min-h-screen px-[5%] pt-[10%] md:px-[10%] md:pt-[3%]">
        <Dialog
          defaultOpen
          onOpenChange={(open) => !open && handleDialogClose()}
        >
          <DialogContent className="border-gray-800 bg-[#141019] backdrop-blur-2xl sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center text-white">
                Connect Wallet to View Rewards
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <ConnectWalletButton redirectTo={`/positions`} />
            </div>
          </DialogContent>
        </Dialog>
        <BlurredStakingBoard />
      </main>
    );
  }
  return (
    <main className="min-h-screen px-[5%] pt-[10%] md:px-[10%] md:pt-[3%]">
      <div className="relative flex flex-col">
        <h1 className="font-funnel flex py-8 text-center text-[32px] font-[400] leading-[36px] tracking-[-5%] md:py-4 md:text-[72px] md:leading-[72px]">
          Your Staking
        </h1>
        <StakePageContent />
      </div>
      <MainNavigation />
    </main>
  );
}

export default UserStakingPositionsPage;
