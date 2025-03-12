"use client";

import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "@/lib/client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { generatePayload, isLoggedIn, login, logout } from "@/actions/login";
import { GetUserQueryKey } from "@/query/get-user";

interface ConnectWalletButtonProps {
  redirectTo?: string;
}

function ConnectWalletButton({ redirectTo }: ConnectWalletButtonProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <div>
      <ConnectButton
        connectButton={{
          label: "Connect Wallet",
          style: {
            borderRadius: "10px",
            borderColor: "white",
            border: "1px solid gray",
            backgroundColor: "#141019",
            color: "white",
          },
          className: "hover:bg-[#141019] hover:text-red-500",
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
