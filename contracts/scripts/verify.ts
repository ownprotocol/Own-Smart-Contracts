import path from "path";
import fs from "fs";

const networkName = "sepolia";

const getAddress = async (contractName: string) => {
  const filePath = path.join(
    __dirname,
    "..",
    "deployments",
    `${networkName}/${contractName}.json`,
  );

  const file = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  return file.address;
};

const formatCommand = (address: string) => {
  return `npx hardhat verify --network ${networkName} ${address}`;
};

const main = async () => {
  const ownAddress = await getAddress("OwnImplementation");
  console.log("*** Commands to run ***");
  console.log(formatCommand(ownAddress));

  const veOwnAddress = await getAddress("VeOwnImplementation");
  console.log(formatCommand(veOwnAddress));

  const presaleAddress = await getAddress("PresaleImplementation");
  console.log(formatCommand(presaleAddress));

  const stakeAddress = await getAddress("StakeImplementation");
  console.log(formatCommand(stakeAddress));

  console.log("*** Etherscan links ***");
  const ownProxy = await getAddress("Own");
  const veOwnProxy = await getAddress("VeOwn");
  const presaleProxy = await getAddress("Presale");
  const stakeProxy = await getAddress("Stake");

  console.log(`Own: https://${networkName}.etherscan.io/address/${ownProxy}`);
  console.log(
    `VeOwn: https://${networkName}.etherscan.io/address/${veOwnProxy}`,
  );
  console.log(
    `Presale: https://${networkName}.etherscan.io/address/${presaleProxy}`,
  );
  console.log(
    `Stake: https://${networkName}.etherscan.io/address/${stakeProxy}`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
