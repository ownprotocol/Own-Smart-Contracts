import {
  ECOSYSTEM_DROPDOWN,
  FOOTER_LINKS,
} from "@/constants/main-navigation-links";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function MainNavigation() {
  return (
    <div className="flex min-h-[100px] w-full justify-between">
      <div className="relative flex-1">
        <Image
          src="/own-logo.svg"
          alt="own logo"
          width={100}
          height={100}
          priority
          className="min-w-8 object-contain"
          style={{ width: "auto", height: "auto" }}
        />
      </div>
      <div className="flex w-full flex-1 gap-16">
        <div className="flex flex-col gap-6">
          <EcosystemDropdown />
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

const EcosystemDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="font-dmMono cursor-pointer text-left text-[10px] leading-[10px] tracking-[0.08em] focus:outline-none md:text-xs md:leading-3 md:tracking-[0.08em]">
        ECOSYSTEM
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-none border-0 bg-[#141019]">
        {ECOSYSTEM_DROPDOWN.map((item) => (
          <DropdownMenuItem
            key={item.name}
            className="rounded bg-slate-900 px-4 py-2 hover:bg-[#1f1a2a] focus:bg-[#1f1a2a]"
          >
            <Link
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-dmMono w-full cursor-pointer text-[10px] leading-[10px] tracking-[0.08em] text-white focus:outline-none md:text-xs md:leading-3 md:tracking-[0.08em]"
            >
              {item.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MainNavigation;
