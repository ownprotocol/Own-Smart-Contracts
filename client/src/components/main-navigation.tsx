import { FOOTER_LINKS } from "@/constants/main-navigation-links";
import Image from "next/image";
import Link from "next/link";
import MainNavigationSkeleton from "@/components/ui/loading-skeletons/main-navigation-skeleton";

interface MainNavigationProps {
  isLoading: boolean;
}

function MainNavigation({ isLoading }: MainNavigationProps) {
  if (isLoading) {
    return <MainNavigationSkeleton />;
  }
  return (
    <div className="mb-[10%] mt-[30%] flex min-h-[100px] w-full justify-between md:mt-16">
      <div className="w-1/3 md:w-1/2">
        <Image src="/own-logo.svg" alt="own logo" width={100} height={100} />
      </div>
      <div className="flex w-full gap-16 pl-12 md:w-1/2 md:gap-28">
        <div className="flex flex-col gap-6">
          {FOOTER_LINKS.leftColumn.map((link) => (
            <Link
              key={link.name}
              href={link.link}
              className="font-dmMono cursor-pointer text-[10px] leading-[10px] tracking-[0.08em] md:text-xs md:leading-3 md:tracking-[0.08em]"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          {FOOTER_LINKS.rightColumn.map((link) => (
            <Link
              key={link.name}
              href={link.link}
              className="font-dmMono cursor-pointer text-[10px] leading-[10px] tracking-[0.08em] md:text-xs md:leading-3 md:tracking-[0.08em]"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainNavigation;
