"use client";

import {
  useActiveAccount,
  useActiveWalletChain,
  useConnect,
} from "thirdweb/react";
import { generatePayload, login } from "@/actions/login";
import { signLoginPayload } from "thirdweb/auth";
import { createWallet } from "thirdweb/wallets";

import { client } from "@/lib/client";

export const LoginButton = () => {
  const account = useActiveAccount();
  const chain = useActiveWalletChain();
  const { connect } = useConnect();

  async function handleClick() {
    let activeAccount;
    if (!account) {
      const wallet = await connect(async () => {
        const metamaskWallet = createWallet("io.metamask");
        await metamaskWallet.connect({ client });
        return metamaskWallet;
      });
      activeAccount = wallet?.getAccount();
    } else {
      activeAccount = account;
    }
    // Step 1: fetch the payload from the server
    const payload = await generatePayload({
      address: activeAccount?.address ?? "",
      chainId: chain?.id,
    });
    if (!activeAccount) {
      throw new Error("No active account found");
    }
    const signatureResult = await signLoginPayload({
      account: activeAccount,
      payload,
    });
    // Step 3: Send the signature to the server for verification
    const finalResult = await login(signatureResult);

    console.log("finalResult", finalResult);
  }

  return <button onClick={handleClick}>Connect</button>;
};

export default LoginButton;
