import { ethers } from "hardhat";

async function main() {
  console.log("Deploying DesignMarketplace contract...");

  // Get the contract factory
  const DesignMarketplace = await ethers.getContractFactory("DesignMarketplace");

  // Deploy the contract
  const designMarketplace = await DesignMarketplace.deploy();

  // Wait for deployment to finish
  await designMarketplace.deployed();

  console.log("DesignMarketplace deployed to:", designMarketplace.address);

  // Save deployment info
  const deploymentInfo = {
    contractAddress: designMarketplace.address,
    network: "blockdag-testnet",
    deployedAt: new Date().toISOString(),
  };

  console.log("Deployment completed!");
  console.log("Contract Address:", designMarketplace.address);
  console.log("Add this address to your .env file as NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
