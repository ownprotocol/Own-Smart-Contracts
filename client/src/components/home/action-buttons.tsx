"use client";
import { Button } from "@/components/ui/button";
import { openWertWidget } from "@/config/wert-config";
import { useGetAuthUser } from "@/query";
import { useEffect, useState } from "react";
import { ConnectWalletButton } from "@/components";

function ActionButtons() {
  const [authCheck, setAuthCheck] = useState(false);
  const { isPending, isValid } = useGetAuthUser();

  useEffect(() => {
    if (!isPending) {
      setAuthCheck(true);
    }
  }, [isPending]);

  const buttonStyles =
    "font-funnel bg-[#C58BFF] px-8 py-6 text-[14px] font-medium leading-[14px] tracking-[0%] text-black hover:bg-[#E49048] md:text-[16px] md:leading-[16px]";
  const cryptoButtonStyles =
    "font-funnel bg-black px-8 py-6 text-[14px] leading-[14px] tracking-[0%] text-white hover:bg-gray-900 md:text-[16px] md:leading-[16px]";

  return (
    <div className="mt-4 flex flex-col gap-3 p-4 md:flex-row md:justify-center md:gap-4">
      {/* Card payment button */}
      {isValid && authCheck && (
        <Button
          className={buttonStyles}
          onClick={() => {
            console.log("Credit card payment clicked");
            openWertWidget();
          }}
        >
          Buy with Card
        </Button>
      )}
      {(!authCheck || isPending) && (
        <Button className={buttonStyles} disabled>
          Loading...
        </Button>
      )}
      {!isValid && authCheck && !isPending && (
        <ConnectWalletButton
          title="Buy with Card"
          bgColor="#C58BFF"
          textColor="black"
          isHoverable={false}
          className="!font-funnel !cursor-pointer !font-semibold"
        />
      )}

      {/* Crypto payment button */}
      {isValid && authCheck && (
        <Button
          className={cryptoButtonStyles}
          onClick={() => {
            // Handle crypto payment
            console.log("Crypto payment clicked");
          }}
        >
          Buy with Crypto
        </Button>
      )}
      {(!authCheck || isPending) && (
        <Button className={cryptoButtonStyles} disabled>
          Loading...
        </Button>
      )}
      {!isValid && authCheck && !isPending && (
        <ConnectWalletButton
          title="Buy with Crypto"
          bgColor="black"
          textColor="white"
          isHoverable={false}
          className="!font-funnel !cursor-pointer !font-semibold"
        />
      )}
    </div>
  );
}

export default ActionButtons;
