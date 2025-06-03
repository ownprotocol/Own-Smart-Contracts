import * as ed from "@noble/ed25519"; // ESM-only. Use bundler for common.js

const main = async () => {
  const privateKey = ed.utils.randomPrivateKey(); // 32-byte Uint8Array or string
  const publicKey = await ed.getPublicKeyAsync(privateKey);

  console.log(`Private key: 0x${Buffer.from(privateKey).toString("hex")}`);
  console.log(`Public key: 0x${Buffer.from(publicKey).toString("hex")}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
