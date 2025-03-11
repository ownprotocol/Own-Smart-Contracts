"use client";

import { Button } from "@/components/ui/button";

function ActionButtons() {
  return (
    <div className="mt-4 flex flex-col gap-3 p-4 md:flex-row md:justify-center md:gap-4">
      <Button
        className="font-funnel bg-[#C58BFF] px-8 py-6 text-[14px] font-medium leading-[14px] tracking-[0%] text-black hover:bg-[#E49048] md:text-[16px] md:leading-[16px]"
        onClick={() => {
          // Handle credit card payment
          console.log("Credit card payment clicked");
        }}
      >
        Buy with Card
      </Button>

      <Button
        className="font-funnel bg-black px-8 py-6 text-[14px] leading-[14px] tracking-[0%] text-white hover:bg-gray-900 md:text-[16px] md:leading-[16px]"
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
