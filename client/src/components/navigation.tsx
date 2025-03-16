"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "./ui/button";
import { icons } from "@/constants/icons";
import { useGetAuthUser } from "@/query/get-user";
import {
  ConnectWalletButton,
  DesktopNavbar,
  MobileSidebar,
} from "@/components";

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
      <DesktopNavbar
        pathname={pathname}
        isValid={isValid ?? false}
        address={address ?? ""}
      />
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        pathname={pathname}
        isValid={isValid ?? false}
        address={address ?? ""}
      />

      <div className="flex items-center justify-center md:justify-end lg:w-48">
        <ConnectWalletButton isHoverable={true} />
      </div>
    </div>
  );
};

export default Navigation;
