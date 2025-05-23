"use client";

import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "@/lib/client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { generatePayload, isLoggedIn, login, logout } from "@/actions/login";
import { GetUserQueryKey } from "@/query/get-user";

interface ConnectWalletButtonProps {
  redirectTo?: "/presale" | "/positions" ;
  title?: string;
  bgColor?: string;
  textColor?: string;
  isHoverable?: boolean;
  className?: string;
}

function ConnectWalletButton({
  redirectTo,
  title,
  bgColor,
  textColor,
  isHoverable,
  className,
}: ConnectWalletButtonProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <ConnectButton
      connectButton={{
        label: title ?? "Connect Wallet",
        className: `!min-w-[125px] !h-[50px] !px-1 !py-0.5 !rounded-lg  !border !border-gray-500 
                       !text-sm !font-normal ${isHoverable ? "hover:!bg-[#C1691180]" : ""}
                    md:!min-w-auto md:!h-10 md:!px-2.5 md:!py-1 !text-center ${className}`,
        style: {
          all: "unset",
          display: "block",
          border: "2px solid white",
          backgroundColor: bgColor ?? "#14101A",
          color: textColor ?? "white",
          margin: "0 auto",
        },
      }}
      autoConnect
      client={client}
      wallets={wallets}
      connectModal={{
        size: "wide",
        title: "Login/Sign up",
      }}
      auth={{
        isLoggedIn: async () => {
          try {
            const result = await isLoggedIn();
            return result.isValid;
          } catch (error) {
            console.error("Error calling isLoggedIn:", error);
            return false;
          }
        },
        doLogin: async (params) => {
          await login(params);
          // Invalidate the user query after login
          await queryClient.invalidateQueries({
            queryKey: [GetUserQueryKey],
          });

          if (redirectTo) {
            if (redirectTo === "/presale") {
              router.push(`/presale`);
            } else if (redirectTo === "/positions") {
              router.push(`/positions`);
            } else {
              router.push("/");
            }
          }
        },
        getLoginPayload: async ({ address }) => generatePayload({ address }),
        doLogout: async () => {
          await logout();
          // Invalidate the user query after logout
          await queryClient.invalidateQueries({
            queryKey: [GetUserQueryKey],
          });
          router.push("/");
        },
      }}
    />
  );
}

export default ConnectWalletButton;
