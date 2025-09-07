import { defineChain } from "thirdweb";

export const blockdagTestnet = defineChain({
  id: 1043,
  name: "BlockDAG Testnet",
  nativeCurrency: {
    name: "BlockDAG",
    symbol: "BDAG",
    decimals: 18,
  },
  rpc: "https://rpc.primordial.bdagscan.com",
  blockExplorers: [
    {
      name: "BlockDAG Testnet Explorer",
      url: "https://explore.primordial.bdagscan.com/",
    },
  ],
  testnet: true,
});
