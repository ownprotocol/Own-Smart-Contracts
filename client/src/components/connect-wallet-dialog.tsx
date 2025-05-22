"use client";

import { useRouter } from "next/navigation";

import { ConnectWalletButton } from "@/components";
import {
  DialogTitle,
  DialogHeader,
  DialogContent,
  Dialog,
} from "@/components/ui/dialog";
import { useEffect } from "react";

interface ConnectWalletDialogProps {
  text: string;
  redirectTo: "/presale" | "/positions";
}
function ConnectWalletDialog({ redirectTo, text }: ConnectWalletDialogProps) {
  const router = useRouter();
  const handleDialogClose = () => {
    router.push("/");
  };

  useEffect(() => {
    return () => handleDialogClose();
  }, []);

  return (
    <Dialog defaultOpen onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="border-gray-800 bg-[#141019] backdrop-blur-2xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-white">{text}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <ConnectWalletButton redirectTo={redirectTo} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConnectWalletDialog;
