const { ethers, upgrades } = require("hardhat");

async function main() {
  const gateWay = await ethers.getContractFactory("Gateway");
  const proxy = await upgrades.deployProxy(gateWay);
  //const phoneLink = await phoneLinks.deploy();
  //await phoneLink.deployed();
  console.log("GateWay Contract deployed to:", proxy.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log("This is error");
    console.error(error);
    process.exit(1);
  });
