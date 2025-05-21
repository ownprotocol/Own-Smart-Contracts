import { FAQPage, TokenomicsChart, TokenomicsChartMobile } from "@/components";
import { PresalePageContents } from "@/components/home/presale_contents";

export default async function HomePage() {
  return (
    <div className="relative flex flex-col items-center">
      <PresalePageContents />
      <TokenomicsChart />
      <TokenomicsChartMobile />
      <FAQPage />
    </div>
  );
}
