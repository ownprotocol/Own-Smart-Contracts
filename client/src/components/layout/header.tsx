"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "../ui/button";
import { icons } from "@/constants/icons";
import {
  ConnectWalletButton,
  DesktopNavbar,
  MobileSidebar,
} from "@/components";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 50;

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 z-50 flex w-full max-w-3xl justify-between pt-2 text-sm text-gray-400",
        { "bg-background": isScrolled },
      )}
    >
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
      <DesktopNavbar pathname={pathname} />
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        pathname={pathname}
      />

      <div className="flex items-center justify-center md:justify-end">
        <ConnectWalletButton isHoverable={true} />
      </div>
    </div>
  );
};

export default Header;
