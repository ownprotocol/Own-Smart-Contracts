"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { usePathname } from "next/navigation";
import { ConnectButton } from "thirdweb/react";
import { client, wallets } from "@/lib/client";

import { generatePayload, isLoggedIn, login, logout } from "@/actions/login";
import { TOP_NAVIGATION_LINKS } from "@/constants/top-navigation-links";
import { icons } from "@/constants/icons";
import { cn } from "@/lib/utils";
import { colors } from "@/constants/thirdweb-styling/theming";

interface NavigationProps {
  authUser:
    | {
        address: null;
        accessToken: null;
        isValid: boolean;
      }
    | {
        address: string;
        accessToken: string;
        isValid: boolean;
      };
}

const Navigation = ({ authUser }: NavigationProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { isValid, address } = authUser;

  return (
    <div className="mt-2 flex flex-row justify-between px-[5%] md:px-[10%]">
      <Button
        variant="ghost"
        className="lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <icons.RxHamburgerMenu className="size-6" aria-hidden="true" />
      </Button>
      <Link href="/">
        <Image src="/own-logo.svg" height={40} width={80} alt="logo" />
      </Link>
      <div className="hidden items-center gap-4 border-gray-500 font-dm_mono md:flex-row lg:flex">
        {TOP_NAVIGATION_LINKS.map((link) => (
          <Link
            key={link.name}
            href={link.link}
            className={cn(
              "transition-colors hover:text-gray-300",
              pathname === link.link
                ? "font-semibold underline underline-offset-4"
                : "",
            )}
          >
            {link.name}
          </Link>
        ))}
        {isValid && (
          <>
            <Link
              href={`/user-stake/${address}/rewards`}
              className={cn(
                "transition-colors hover:text-gray-300",
                pathname === `/user-stake/${address}/rewards`
                  ? "font-semibold underline underline-offset-4"
                  : "",
              )}
            >
              Rewards
            </Link>
            <Link
              href={`/user-stake/${address}/positions`}
              className={cn(
                "transition-colors hover:text-gray-300",
                pathname === `/user-stake/${address}/positions`
                  ? "font-semibold underline underline-offset-4"
                  : "",
              )}
            >
              Positions
            </Link>
          </>
        )}
      </div>

      {/* mobile side navbar */}

      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="data-closed:opacity-0 fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="data-closed:-translate-x-full relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out"
          >
            <TransitionChild>
              <div className="data-closed:opacity-0 absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <icons.VscClose
                    aria-hidden="true"
                    className="size-6 text-white"
                  />
                </button>
              </div>
            </TransitionChild>
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
              <div className="flex h-16 shrink-0 items-center">
                <Image
                  src="/own-logo.svg"
                  alt="Your Company"
                  width={80}
                  height={40}
                  className="h-8 w-auto"
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {TOP_NAVIGATION_LINKS.map((item) => (
                        <li key={item.name}>
                          <Link
                            onClick={() => setSidebarOpen(false)}
                            href={item.link}
                            className={cn(
                              pathname === item.link
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className="size-6 shrink-0"
                            />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs/6 font-semibold text-gray-400">
                      Your teams
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <ConnectButton
        client={client}
        wallets={wallets}
        theme={{
          colors: {
            ...colors,
            connectedButtonBg: "rgb(31 41 100)", // bg-gray-800
          },
          fontFamily: "Funnel Sans, system-ui, sans-serif",
          type: "dark",
        }}
        connectModal={{
          size: "wide",
          title: "Login/Sign up",
        }}
        auth={{
          isLoggedIn: async (address) => {
            console.log("checking if logged in!", { address });
            const { isValid } = await isLoggedIn();
            return isValid;
          },
          doLogin: async (params) => {
            console.log("logging in!");
            await login(params);
          },
          getLoginPayload: async ({ address }) => generatePayload({ address }),
          doLogout: async () => {
            console.log("logging out!");
            await logout();
          },
        }}
      />
    </div>
  );
};

export default Navigation;
