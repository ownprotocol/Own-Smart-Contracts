/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// LoginButton.tsx
"use client";

import {
  useActiveAccount,
  useActiveWalletChain,
  useConnect,
} from "thirdweb/react";
import { generatePayload, login } from "@/actions/login"; // we'll add this file in the next section
import { signLoginPayload } from "thirdweb/auth";
import { createWallet } from "thirdweb/wallets";
import { client } from "@/lib/client";

// Define Sepolia chain ID
const SEPOLIA_CHAIN_ID = 11155111;

export const LoginButton = () => {
  const account = useActiveAccount();
  const chain = useActiveWalletChain();
  const {
    connect,
    //  isConnecting, error
  } = useConnect();

  async function handleClick() {
    let activeAccount;
    if (!account) {
      const wallet = await connect(async () => {
        const wallet = createWallet("io.metamask"); // update this to your wallet of choice or create a custom UI to select wallets
        await wallet.connect({
          client,
        });
        return wallet;
      });
      activeAccount = wallet?.getAccount() ?? undefined;
    } else {
      activeAccount = account;
    }
    // Step 1: fetch the payload from the server
    const payload = await generatePayload({
      address: activeAccount?.address ?? "",
      chainId: SEPOLIA_CHAIN_ID, // Use Sepolia chain ID instead of chain!.id
    });
    // Step 2: Sign the payload
    if (!activeAccount) {
      alert("No active account found");
      return;
    }

    const signatureResult = await signLoginPayload({
      account: activeAccount,
      payload,
    });
    // Step 3: Send the signature to the server for verification
    await login(signatureResult);
  }

  return <button onClick={handleClick}>Login button</button>;
};

export default LoginButton;
