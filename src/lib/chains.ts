
import { defineChain } from "thirdweb";

// Define BDAG Testnet
export const bdagTestnet = defineChain({
  id: 1043, // Keep this for the old testnet if your contract is there
  name: "BlockDAG Testnet",
  nativeCurrency: {
    name: "BDAG",
    symbol: "BDAG",
    decimals: 18,
  },
  rpc: "https://rpc-testnet.blockdag.network", // New RPC for the new testnet
  blockExplorers: [
    {
      name: "BlockDAG Explorer",
      url: "https://testnet.bdagscan.com", // New explorer for the new testnet
    },
  ],
  testnet: true,
});
