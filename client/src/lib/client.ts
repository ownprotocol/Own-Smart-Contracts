import { env } from "@/env";
import { createThirdwebClient } from "thirdweb";
import { inAppWallet } from "thirdweb/wallets";
import { createWallet } from "thirdweb/wallets";

const clientId = env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

export const client = createThirdwebClient({ clientId });

export const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "discord", "telegram", "email", "x"],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];
