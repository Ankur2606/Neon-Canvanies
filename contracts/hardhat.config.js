import "@nomicfoundation/hardhat-toolbox";

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: "0.8.24",
  networks: {
    blockdagTestnet: {
      url: "https://rpc-testnet.blockdag.network",
      chainId: 2018,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;
