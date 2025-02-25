"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";

function HomeSeparator() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (!isHomePage) return null;

  return (
    <Separator
      orientation="vertical"
      className="absolute left-[35%] -z-10 h-full -translate-x-1/2 bg-gray-500/30"
    />
  );
}

export default HomeSeparator;
