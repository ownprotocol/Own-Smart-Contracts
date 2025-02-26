import Image from "next/image";
import { Button } from "./ui/button";
import { TOP_NAVIGATION_LINKS } from "@/constants/top-navigation-links";
import Link from "next/link";
const Navigation = () => {
  return (
    <div className="mx-[10%] mt-2 flex flex-row justify-between">
      <Image src="/own-logo.svg" height={40} width={80} alt="logo" />
      <div className="flex flex-row gap-4 items-center font-dm_mono border-gray-500">
        {TOP_NAVIGATION_LINKS.map((link) => (
          <Link key={link.name} href={link.link}>
            {link.name}
          </Link>
        ))}
      <Button variant="outline" className="font-dm_mono border-gray-500">
        Connect Wallet
      </Button>
      </div>

    </div>
  );
};

export default Navigation;
