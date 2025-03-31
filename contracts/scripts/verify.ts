import { getLocalAddress } from "../helpers/evm";

const networkName = "sepolia";

const formatCommand = (address: string) => {
  return `npx hardhat verify --network ${networkName} ${address}`;
};

const main = async () => {
  const ownAddress = await getLocalAddress("OwnImplementation", networkName);
  console.log("*** Commands to run ***");
  console.log(formatCommand(ownAddress));

  const veOwnAddress = await getLocalAddress(
    "VeOwnImplementation",
    networkName
  );
  console.log(formatCommand(veOwnAddress));

  const presaleAddress = await getLocalAddress(
    "PresaleImplementation",
    networkName
  );
  console.log(formatCommand(presaleAddress));

  const stakeAddress = await getLocalAddress(
    "StakeImplementation",
    networkName
  );
  console.log(formatCommand(stakeAddress));

  if (networkName === "sepolia") {
    const usdtAddress = await getLocalAddress("mockUSDT", networkName);
    console.log(formatCommand(usdtAddress));
  }

  console.log("*** Etherscan links ***");
  const ownProxy = await getLocalAddress("Own", networkName);
  const veOwnProxy = await getLocalAddress("VeOwn", networkName);
  const presaleProxy = await getLocalAddress("Presale", networkName);
  const stakeProxy = await getLocalAddress("Stake", networkName);

  console.log(`Own: https://${networkName}.etherscan.io/address/${ownProxy}`);
  console.log(
    `VeOwn: https://${networkName}.etherscan.io/address/${veOwnProxy}`
  );
  console.log(
    `Presale: https://${networkName}.etherscan.io/address/${presaleProxy}`
  );
  console.log(
    `Stake: https://${networkName}.etherscan.io/address/${stakeProxy}`
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
