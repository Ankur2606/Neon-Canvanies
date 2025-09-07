const { ethers } = require("hardhat");

async function main() {
  const BdagCredit = await ethers.getContractFactory("BdagCredit");
  const bdagCredit = await BdagCredit.deploy();

  await bdagCredit.waitForDeployment();

  console.log("BdagCredit deployed to:", await bdagCredit.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
