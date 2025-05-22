import { icons } from "@/constants/icons";

export const DISCONNECTED_NAVIGATION_LINKS = [
  { name: "Home", link: "/", icon: icons.RiHomeLine },
  { name: "Staking", link: "/staking", icon: icons.GiReceiveMoney },
];

export const TOP_NAVIGATION_LINKS = [
  ...DISCONNECTED_NAVIGATION_LINKS,
  {
    name: "Presale",
    link: "/presale",
    icon: icons.FaArchive,
  },
  {
    name: "Positions",
    link: "/positions",
    icon: icons.FaAdjust,
  },
];
