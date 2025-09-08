
import { defineChain } from "thirdweb";

// Define BDAG Testnet
export const bdagTestnet = defineChain({
  id: 2018, // Corrected Chain ID
  name: "BlockDAG Testnet",
  nativeCurrency: {
    name: "BDAG",
    symbol: "BDAG",
    decimals: 18,
  },
  rpc: "https://rpc-testnet.blockdag.network",
  blockExplorers: [
    {
      name: "BlockDAG Explorer",
      url: "https://testnet.bdagscan.com",
    },
  ],
  testnet: true,
});
