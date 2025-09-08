import hardhat from "hardhat";

const { ethers } = hardhat;

async function main() {
  const BdagJobPayment = await ethers.getContractFactory("BdagJobPayment");
  const bdagJobPayment = await BdagJobPayment.deploy();

  await bdagJobPayment.waitForDeployment();

  console.log("BdagJobPayment deployed to:", await bdagJobPayment.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
