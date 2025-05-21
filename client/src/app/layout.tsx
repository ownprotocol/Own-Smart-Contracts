import { DM_Mono, DM_Sans, Funnel_Sans } from "next/font/google";
import { type Metadata } from "next";
import { ToastContainer } from "react-toastify";
import { ThirdwebProvider } from "thirdweb/react";

import { Footer, Header, HomeSeparator, MainNavigation } from "@/components";
import "@/styles/globals.css";
import QueryProvider from "@/providers/query-client-provider";

const fun = Funnel_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-funnel-sans",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});
const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-mono",
  weight: "300",
});

export const metadata: Metadata = {
  title: "Fasset",
  description: "Fasset Presale & Staking",
  // TODO get favicon from client
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fun.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body className="flex flex-col bg-[linear-gradient(to_bottom,#141019_48%,#E49048_48%,#E49048_48%,#141019_48%)] text-white">
        <div className="container relative mx-auto flex max-w-7xl flex-col border-x border-gray-500/30">
          <QueryProvider>
            <ThirdwebProvider>
              <Header />
              <HomeSeparator />
              <ToastContainer />
              <div className="flex min-h-screen w-full flex-col justify-between px-8 pb-24 pt-24">
                {children}
                <MainNavigation />
              </div>
              <Footer />
            </ThirdwebProvider>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
