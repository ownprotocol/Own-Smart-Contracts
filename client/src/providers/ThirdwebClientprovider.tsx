"use client";

import { ThirdwebProvider } from "thirdweb/react";
import { type ReactNode } from "react";

export default function ThirdwebClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
}
