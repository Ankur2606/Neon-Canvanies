import { bdagTestnet } from "./chains";

// Use the active wallet's sendTransaction method
export async function transferBDAG(wallet: any, toAddress: string, amount: string) {
  if (!wallet || typeof wallet.sendTransaction !== "function") {
    throw new Error("Wallet not connected or sendTransaction not available");
  }
  return await wallet.sendTransaction({
    to: toAddress,
    value: amount,
    chain: bdagTestnet,
  });
}
