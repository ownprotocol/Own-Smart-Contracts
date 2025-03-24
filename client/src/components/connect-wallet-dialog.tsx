"use client";

import { useRouter } from "next/navigation";

import { ConnectWalletButton } from "@/components";
import {
  DialogTitle,
  DialogHeader,
  DialogContent,
  Dialog,
} from "@/components/ui/dialog";

interface ConnectWalletDialogProps {
  redirectTo: string;
}
function ConnectWalletDialog({ redirectTo }: ConnectWalletDialogProps) {
  const router = useRouter();
  const handleDialogClose = () => {
    router.push("/");
  };
  return (
    <Dialog defaultOpen onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="border-gray-800 bg-[#141019] backdrop-blur-2xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-white">
            Connect Wallet to View Rewards
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <ConnectWalletButton redirectTo={redirectTo} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConnectWalletDialog;
