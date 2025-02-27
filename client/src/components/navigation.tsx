import Image from "next/image";
import { Button } from "./ui/button";
import { TOP_NAVIGATION_LINKS } from "@/constants/top-navigation-links";
import Link from "next/link";
const Navigation = () => {
  return (
    <div className="mx-[10%] mt-2 flex flex-row justify-between">
      <Image src="/own-logo.svg" height={40} width={80} alt="logo" />
      <div className="hidden items-center gap-4 border-gray-500 font-dm_mono md:flex-row lg:flex">
        {TOP_NAVIGATION_LINKS.map((link) => (
          <Link key={link.name} href={link.link}>
            {link.name}
          </Link>
        ))}
      </div>
      <Button variant="outline" className="border-gray-500 font-dm_mono">
        Connect Wallet
      </Button>
    </div>
  );
};

export default Navigation;
