"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

// This component is used to create a separator - design on the home page
function HomeSeparator() {
  const pathname = usePathname();
  const showSeparator = pathname === "/" || pathname === "/staking";
  const hasPresaleConcluded = true;

  if (!showSeparator || !hasPresaleConcluded) return null;

  return (
    <Separator
      orientation="vertical"
      className="absolute left-[35%] -z-50 h-full -translate-x-1/2 bg-gray-500/30 hidden md:block"
    />
  );
}

export default HomeSeparator;
