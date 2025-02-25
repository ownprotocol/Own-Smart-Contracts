"use client";

import { Button } from "@/components/ui/button";

function ActionButtons() {
  return (
    <div className="flex flex-col gap-3 p-4 sm:flex-row md:justify-center md:gap-4 mt-4">
      <Button
        className="bg-[#9333EA] px-8 py-6 text-lg text-white hover:bg-[#7E22CE]"
        onClick={() => {
          // Handle credit card payment
          console.log("Credit card payment clicked");
        }}
      >
        Buy with Credit Card
      </Button>

      <Button
        className="bg-black px-8 py-6 text-lg text-white hover:bg-gray-900"
        onClick={() => {
          // Handle crypto payment
          console.log("Crypto payment clicked");
        }}
      >
        Buy with Crypto
      </Button>
    </div>
  );
}

export default ActionButtons;