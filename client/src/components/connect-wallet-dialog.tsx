import { DialogTitle } from "@radix-ui/react-dialog";

import { DialogContent } from "@radix-ui/react-dialog";

import { Dialog } from "@radix-ui/react-dialog";
import { ConnectWalletButton } from ".";
import { DialogHeader } from "./ui/dialog";

function ConnectWalletDialog({ onClose }: { onClose: () => void }) {
  return (
    <Dialog defaultOpen onOpenChange={(open) => !open && onClose()}>
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
  );
}

export default ConnectWalletDialog;
