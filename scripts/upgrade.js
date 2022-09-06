const { ethers, upgrades } = require("hardhat");

async function main() {
  const gateWay = await ethers.getContractFactory("Gateway");
  let proxy = await upgrades.upgradeProxy(
    "0xe7302C6895C540469396A4AA349D1B2931237C39", //KAI test
    gateWay
  );
  console.log("Gateway contract has been successfully upgraded.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("This is error");
    console.error(error);
    process.exit(1);
  });
