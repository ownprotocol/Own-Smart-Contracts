"use client";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NetworkSwitchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitch: () => void;
  networkName?: string;
  title: string;
}

function NetworkSwitchDialog({
  isOpen,
  onClose,
  onSwitch,
  title,
}: NetworkSwitchDialogProps) {
  return (
    <div className="relative flex flex-col">
      <Dialog defaultOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="border-gray-800 bg-[#141019] backdrop-blur-2xl sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-white">
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <Button
              onClick={onSwitch}
              className="w-1/2 rounded-lg bg-[#9333EA] px-6 py-3 text-white transition-colors hover:bg-[#7E22CE]"
            >
              Switch
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NetworkSwitchDialog;
