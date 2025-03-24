"use client";
import { useActiveAccount } from "thirdweb/react";

import {
  BlurredStakingBoard,
  ConnectWalletButton,
  MainNavigation,
} from "@/components";
import { PresalePurchasesPageContent } from "@/components/presale/presale-purchases-page-content";
import {
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

function PresalePurchasesPage() {
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
              <ConnectWalletButton redirectTo={`/presale`} />
            </div>
          </DialogContent>
        </Dialog>
        <BlurredStakingBoard />
      </main>
    );
  }
  return (
    <main className="min-h-screen px-[5%] pt-4 md:px-[10%] md:pt-8">
      <div className="mx-auto flex w-full flex-col items-center justify-center md:w-[75%]">
        <h1 className="font-funnel flex text-center text-[32px] font-[400] leading-[36px] tracking-[-5%] md:py-4 md:text-[72px] md:leading-[72px]">
          $Own Token Presale Purchases
        </h1>
      </div>
      <PresalePurchasesPageContent />
      <MainNavigation />
    </main>
  );
}

export default PresalePurchasesPage;
