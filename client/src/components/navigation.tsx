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

import { TOP_NAVIGATION_LINKS } from "@/constants/top-navigation-links";
import { icons } from "@/constants/icons";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const activeNavigationLink = TOP_NAVIGATION_LINKS.find((link) =>
    pathname.includes(link.link),
  );

  return (
    <div className="mx-[10%] mt-2 flex flex-row justify-between">
      <Button
        variant="ghost"
        className="pl-0 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <icons.RxHamburgerMenu className="size-6" aria-hidden="true" />
      </Button>
      <Image src="/own-logo.svg" height={40} width={80} alt="logo" />
      <div className="hidden items-center gap-4 border-gray-500 font-dm_mono md:flex-row lg:flex">
        {TOP_NAVIGATION_LINKS.map((link) => (
          <Link key={link.name} href={link.link}>
            {link.name}
          </Link>
        ))}
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
                            href={item.link}
                            className={cn(
                              activeNavigationLink?.name === item.name
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

      <Button variant="outline" className="border-gray-500 font-dm_mono">
        <span className="hidden sm:inline">Connect Wallet</span>
        <span className="sm:hidden">Connect</span>
      </Button>
    </div>
  );
};

export default Navigation;
