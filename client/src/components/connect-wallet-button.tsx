"use client";

import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "@/lib/client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { generatePayload, isLoggedIn, login, logout } from "@/actions/login";
import { GetUserQueryKey } from "@/query/get-user";

interface ConnectWalletButtonProps {
  redirectTo?: string;
  title?: string;
  bgColor?: string;
  textColor?: string;
}

function ConnectWalletButton({
  redirectTo,
  title,
}: ConnectWalletButtonProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <div className="">
      <ConnectButton
        connectButton={{
          label: title ?? "Connect Wallet",
          className: `!min-w-[125px] !h-[50px] !px-1 !py-0.5 !rounded-lg !border !border-gray-500 
                   !bg-[#14101A] !text-white !text-sm !font-normal hover:!bg-[#C1691180]
                   md:!min-w-auto md:!h-10 md:!px-2.5 md:!py-1 !text-center`,
          style: {
            all: "unset",
            display: "block",
            border: "2px solid white",
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
              if (redirectTo === "/user-stake/rewards") {
                router.push(`/user-stake/${params.payload.address}/rewards`);
              } else if (redirectTo === "/user-stake/positions") {
                router.push(`/user-stake/${params.payload.address}/positions`);
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
    </div>
  );
}

export default ConnectWalletButton;
