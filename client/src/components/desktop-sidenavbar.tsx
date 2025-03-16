"use client";

import Link from "next/link";

import { TOP_NAVIGATION_LINKS } from "@/constants/top-navigation-links";
import { cn } from "@/lib/utils";

const DesktopNavbar = ({
  pathname,
  isValid,
  address,
}: {
  pathname: string;
  isValid: boolean;
  address: string | undefined;
}) => {
  return (
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
  );
};

export default DesktopNavbar;
