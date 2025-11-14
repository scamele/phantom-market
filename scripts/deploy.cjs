const hre = require("hardhat");

async function main() {
  console.log("Deploying PhantomRelayLeague contract to Sepolia...");

  const PhantomRelayLeague = await hre.ethers.getContractFactory("PhantomRelayLeague");
  const contract = await PhantomRelayLeague.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ PhantomRelayLeague deployed to:", address);
  console.log("\n📋 Update frontend/src/constants/contracts.ts with this address:");
  console.log(`export const PHANTOM_RELAY_LEAGUE_ADDRESS = "${address}" as \`0x\${string}\`;`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
