import Link from "next/link";

import { icons } from "@/constants/icons";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 z-50 mt-auto flex w-screen flex-col items-center justify-between bg-background text-sm text-gray-400">
      <div className="flex w-full flex-row items-center justify-between border-t-2 border-gray-500/30 px-[15%] py-10">
        <div className="font-dmMono text-[10px] leading-[10px] tracking-[0.08em] md:text-xs md:leading-3 md:tracking-[0.08em]">
          COPYRIGHT BY FASSET.COM {new Date().getFullYear()}
        </div>

        <div className="flex items-end justify-between gap-8">
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
    </footer>
  );
};

export default Footer;
