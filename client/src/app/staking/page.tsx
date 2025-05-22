import { type Metadata } from "next";
import { StakingPageContent } from "@/components/staking/staking-page-content";

export const metadata: Metadata = {
  title: "Fasset",
  description: "Stake $Own Token",
  icons: [{ rel: "icon", url: "/own-favicon.png" }],
};

export default function StakingPage() {
  return <StakingPageContent />;
}
