"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { usePathname } from "next/navigation";

import { Button } from "./ui/button";
import { TOP_NAVIGATION_LINKS } from "@/constants/top-navigation-links";
import { icons } from "@/constants/icons";
import { cn } from "@/lib/utils";
import { useGetAuthUser } from "@/query/get-user";
import { ConnectWalletButton } from "@/components";

const Navigation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname();

  const { isValid, address } = useGetAuthUser();

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
      <Link href="/" className="flex items-center justify-center">
        <Image src="/own-logo.svg" height={40} width={80} alt="logo" />
      </Link>
      <div className="hidden items-center justify-center gap-4 border-gray-500 font-dm_mono lg:flex lg:w-[500px] lg:flex-row">
        {TOP_NAVIGATION_LINKS.map((link) => (
          <Link
            key={link.name}
            href={link.link}
            className={cn(
              "tracking-normal transition-colors hover:text-gray-300",
              pathname === link.link
                ? "font-semibold underline underline-offset-4"
                : "",
            )}
          >
            {link.name}
          </Link>
        ))}
        {!isValid && (
          <>
            <Link
              href={`/unauthorized/user-stake/rewards`}
              className={cn(
                "tracking-normal transition-colors hover:text-gray-300",
                pathname === `/unauthorized/user-stake/rewards`
                  ? "font-semibold underline underline-offset-4"
                  : "",
              )}
            >
              Rewards
            </Link>
            <Link
              href={`/unauthorized/user-stake/positions`}
              className={cn(
                "tracking-normal transition-colors hover:text-gray-300",
                pathname === `/unauthorized/user-stake/positions`
                  ? "font-semibold underline underline-offset-4"
                  : "",
              )}
            >
              Positions
            </Link>
          </>
        )}
        {isValid && (
          <>
            <Link
              href={`/user-stake/${address}/rewards`}
              className={cn(
                "tracking-normal transition-colors hover:text-gray-300",
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
                "tracking-normal transition-colors hover:text-gray-300",
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
                      {!isValid && (
                        <li className="">
                          <Link
                            onClick={() => setSidebarOpen(false)}
                            href={`/unauthorized/user-stake/rewards`}
                            className={cn(
                              pathname === `/unauthorized/user-stake/rewards`
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                            )}
                          >
                            <icons.RiAedLine
                              aria-hidden="true"
                              className="size-6 shrink-0"
                            />
                            <p>Rewards</p>
                          </Link>
                          <Link
                            onClick={() => setSidebarOpen(false)}
                            href={`/unauthorized/user-stake/positions`}
                            className={cn(
                              pathname === `/unauthorized/user-stake/positions`
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                            )}
                          >
                            <icons.RiAddLargeLine
                              aria-hidden="true"
                              className="size-6 shrink-0"
                            />
                            <p>Positions</p>
                          </Link>
                        </li>
                      )}
                      {isValid && (
                        <li className="">
                          <Link
                            onClick={() => setSidebarOpen(false)}
                            href={`/user-stake/${address}/rewards`}
                            className={cn(
                              pathname === `/user-stake/${address}/rewards`
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                            )}
                          >
                            <icons.RiAedLine
                              aria-hidden="true"
                              className="size-6 shrink-0"
                            />
                            <p>Rewards</p>
                          </Link>
                          <Link
                            onClick={() => setSidebarOpen(false)}
                            href={`/user-stake/${address}/positions`}
                            className={cn(
                              pathname === `/user-stake/${address}/positions`
                                ? "bg-gray-800 text-white"
                                : "text-gray-400 hover:bg-gray-800 hover:text-white",
                              "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                            )}
                          >
                            <icons.RiAddLargeLine
                              aria-hidden="true"
                              className="size-6 shrink-0"
                            />
                            <p>Positions</p>
                          </Link>
                        </li>
                      )}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <div className="flex items-center justify-center md:justify-end lg:w-48">
        <ConnectWalletButton isHoverable={true} />
      </div>
    </div>
  );
};

export default Navigation;
