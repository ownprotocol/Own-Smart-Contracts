"use client";

import {
  StakeOwnTokenBanner,
  EarnAPYTimer,
  MainNavigation,
} from "@/components";
import { useState } from "react";
import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "@/lib/client";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import StakingDrawerContent from "@/components/staking/staking-drawer-content";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { GetUserQueryKey, useGetAuthUser } from "@/query";
import { isLoggedIn, logout } from "@/actions/login";
import { generatePayload, login } from "@/actions/login";

function StakingPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { isValid } = useGetAuthUser();
  console.log(isValid);

  return (
    <main className="min-h-screen px-[5%] pt-4 md:px-[10%] md:pt-8">
      <div className="relative flex flex-col">
        <StakeOwnTokenBanner />
        <EarnAPYTimer />
        <div className="mt-2 flex flex-col gap-3 p-4 sm:flex-row md:justify-center md:gap-4">
          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              {isValid && (
                <Button
                  className="font-funnel bg-[#C58BFF] px-8 py-6 text-[14px] font-medium leading-[14px] tracking-[0%] text-black hover:bg-[#E49048] md:text-[16px] md:leading-[16px]"
                  onClick={() => {
                    console.log("Stake $Own clicked");
                  }}
                >
                  Stake $Own
                </Button>
              )}
            </DrawerTrigger>
            <DrawerContent className="h-[90vh] max-h-[90vh] px-[5%] md:px-[10%] xl:h-[90vh] xl:max-h-[90vh]">
              <StakingDrawerContent />
            </DrawerContent>
          </Drawer>
        </div>
        {/* create a useConnectModal */}
        {!isValid && (
          //
          <ConnectButton
            connectButton={{
              label: "Stake $Own",
              style: {
                borderRadius: "10px",
                borderColor: "white",
                backgroundColor: "#C58BFF",
                color: "black",
                width: "10%",
                margin: "0 auto 0 auto",
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
              isLoggedIn: async (address) => {
                console.log("checking if logged in!", { address });
                try {
                  console.log("About to call isLoggedIn function");
                  const result = await isLoggedIn();
                  console.log("isLoggedIn function returned:", result);
                  return result.isValid;
                } catch (error) {
                  console.error("Error calling isLoggedIn:", error);
                  return false;
                }
              },
              doLogin: async (params) => {
                console.log("logging in!");
                await login(params);
                // Invalidate the user query after login
                await queryClient.invalidateQueries({
                  queryKey: [GetUserQueryKey],
                });
              },
              getLoginPayload: async ({ address }) =>
                generatePayload({ address }),
              doLogout: async () => {
                console.log("logging out!");
                await logout();
                // Invalidate the user query after logout
                await queryClient.invalidateQueries({
                  queryKey: [GetUserQueryKey],
                });
                router.push("/");
              },
            }}
          />
        )}
        <MainNavigation isLoading={false} />
      </div>
    </main>
  );
}

export default StakingPage;
