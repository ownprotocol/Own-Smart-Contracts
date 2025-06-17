import { ethers } from "hardhat";
import { getContractInstancesFromDeployment } from "../helpers/testing-api";
import hre from "hardhat";

async function main() {
  const { presale } = await getContractInstancesFromDeployment(
    await hre.deployments.all(),
  );

  const startRound = 30;
  const roundsToUpdate = 1;

  for (let i = 0; i < roundsToUpdate; i++) {
    // Update the rounds to 2 mins
    await presale.write.updatePresaleRoundDuration([startRound + i, 120]);
    console.log(`Updated round ${startRound + i} duration to 120 seconds`);
  }

  console.log(`Successfully updated ${roundsToUpdate} presale rounds`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

