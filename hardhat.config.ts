import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    "blockdag-testnet": {
      url: process.env.BLOCKDAG_RPC_URL || "https://rpc.testnet.blockdag.network",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 1043,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
      },
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: {
      "blockdag-testnet": process.env.BLOCKDAG_API_KEY || "",
    },
    customChains: [
      {
        network: "blockdag-testnet",
        chainId: 1043,
        urls: {
          apiURL: "https://api-testnet.blockdag.network/api",
          browserURL: "https://testnet.blockdag.network",
        },
      },
    ],
  },
};

export default config;
