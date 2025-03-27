import PresalePurchasesPageContent from "@/components/presale/presale-client";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Presale",
  description: "View and manage your Fasset presale token purchases",
  icons: [{ rel: "icon", url: "/own-favicon.png" }],

};

export default function PresalePurchasesPage() {
  return <PresalePurchasesPageContent />;
}
