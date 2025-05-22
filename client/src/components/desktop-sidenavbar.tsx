"use client";

import Link from "next/link";

import {
  DISCONNECTED_NAVIGATION_LINKS,
  TOP_NAVIGATION_LINKS,
} from "@/constants/top-navigation-links";
import { cn } from "@/lib/utils";

const DesktopNavbar = ({
  pathname,
  connected,
}: {
  pathname: string;
  connected: boolean;
}) => {
  const links = connected
    ? TOP_NAVIGATION_LINKS
    : DISCONNECTED_NAVIGATION_LINKS;

  return (
    <div className="hidden items-center justify-center gap-4 border-gray-500 font-dm_mono lg:flex lg:flex-row">
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.link}
          className={cn(
            "!text-md font-bold tracking-normal text-gray-100 transition-colors hover:text-gray-300",
            pathname === link.link
              ? "font-semibold underline underline-offset-4"
              : "",
          )}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default DesktopNavbar;
