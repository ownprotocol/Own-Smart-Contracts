"use server";
import { type VerifyLoginPayloadParams, createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { client } from "@/lib/client";
import { cookies } from "next/headers";

const privateKey = process.env.AUTH_PRIVATE_KEY ?? "";

if (!privateKey) {
  throw new Error("Missing AUTH_PRIVATE_KEY in .env file.");
}

const thirdwebAuth = createAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN ?? "",
  adminAccount: privateKeyToAccount({ client, privateKey }),
  client: client,
});

export const generatePayload = thirdwebAuth.generatePayload;

export async function login(payload: VerifyLoginPayloadParams) {
  const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
  if (verifiedPayload.valid) {
    const jwt = await thirdwebAuth.generateJWT({
      payload: verifiedPayload.payload,
      context: {
        user: true,
      },
    });
    (await cookies()).set("jwt", jwt);
  }
}

export async function isLoggedIn() {
  const jwt = (await cookies()).get("jwt");
  if (!jwt?.value) {
    return {address: null, accessToken: null, isValid: false};
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt: jwt.value });
  if (authResult.valid) {
    return {address: authResult.parsedJWT.sub, accessToken: jwt.value, isValid: true};
  }
  return {address: null, accessToken: null, isValid: false};
}


export async function logout() {
  (await cookies()).delete("jwt");
}
