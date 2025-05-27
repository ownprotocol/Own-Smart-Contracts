import Link from "next/link";

import { icons } from "@/constants/icons";
import MainNavigation from "./main-navigation";

const Footer = () => {
  return (
    <div className="flex flex-col gap-8 px-8 pb-8">
      <MainNavigation />

      <div className="flex w-full gap-4">
        <div className="font-dmMono flex flex-1 items-center text-[10px] leading-[10px] tracking-[0.08em] md:text-xs md:leading-3 md:tracking-[0.08em]">
          COPYRIGHT BY FASSET.COM {new Date().getFullYear()}
        </div>

        <div className="flex flex-1 items-center gap-12">
          <h1 className="font-dmMono text-[12px] leading-[12px] tracking-[0.08em] md:text-xs md:leading-3 md:tracking-[0.08em]">
            FOLLOW US
          </h1>
          <div className="flex gap-2">
            <Link
              href="https://twitter.com/fasset"
              target="_blank"
              aria-label="Twitter"
            >
              <icons.FaXTwitter className="h-5 w-5 text-white transition-colors hover:text-white" />
            </Link>

            <Link
              href="https://t.me/fasset"
              target="_blank"
              aria-label="Telegram"
            >
              <icons.PiTelegramLogoDuotone className="h-5 w-5 text-white transition-colors hover:text-white" />
            </Link>

            <Link
              href="https://discord.gg/fasset"
              target="_blank"
              aria-label="Discord"
            >
              <icons.AiOutlineDiscord className="h-5 w-5 text-white transition-colors hover:text-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
