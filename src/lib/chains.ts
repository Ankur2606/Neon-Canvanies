
import { defineChain } from "thirdweb";

// Define BDAG Testnet
export const bdagTestnet = defineChain({
  id: 1043,
  name: "BlockDAG Testnet",
  nativeCurrency: {
    name: "BDAG",
    symbol: "BDAG",
    decimals: 18,
  },
  rpc: "https://rpc.primordial.bdagscan.com",
  blockExplorers: [
    {
      name: "BlockDAG Explorer",
      url: "https://primordial.bdagscan.com",
    },
  ],
  testnet: true,
});
