import { isLoggedIn } from "@/actions/login";
import {
  FAQPage,
  MainNavigation,
  TokenomicsChart,
  TokenomicsChartMobile,
} from "@/components";
import { PresalePageContents } from "@/components/home/presale_contents";

export default async function HomePage() {
  await isLoggedIn();

  return (
    <main className="min-h-screen px-[5%] pt-[10%] md:px-[10%] md:pt-[3%]">
      <div className="relative flex flex-col">
        <PresalePageContents />
        <TokenomicsChart />
        <TokenomicsChartMobile />
        <FAQPage />
        <MainNavigation />
      </div>
    </main>
  );
}
