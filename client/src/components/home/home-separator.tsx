"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

// This component is used to create a separator - design on the home page
function HomeSeparator() {
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "/staking";
  const hasPresaleConcluded = true;

  if (!isHomePage || !hasPresaleConcluded) return null;

  return (
    <Separator
      orientation="vertical"
      className="absolute left-[35%] -z-10 h-full -translate-x-1/2 bg-gray-500/30"
    />
  );
}

export default HomeSeparator;
