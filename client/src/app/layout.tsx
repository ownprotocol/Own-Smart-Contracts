import Navigation from "@/components/navigation";
import "@/styles/globals.css";

import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Fasset",
  description: "Fasset Presale & Staking",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex flex-col bg-[linear-gradient(to_bottom,#141019_48%,#E49048_48%,#E49048_48%,#141019_48%)] text-white">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
