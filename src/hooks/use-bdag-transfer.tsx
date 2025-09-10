
'use client';

import { useState } from "react";
import { useActiveAccount, useSendTransaction, useSwitchActiveWalletChain } from "thirdweb/react";
import { prepareTransaction, toWei } from "thirdweb";
import { getWalletBalance } from "thirdweb/wallets";
import { bdagTestnet } from "@/lib/chains";
import { client } from "@/lib/thirdweb";
import { useToast } from "@/hooks/use-toast";

export function useBdagTransfer() {
  const account = useActiveAccount();
  const { mutate: sendTransaction, isPending } = useSendTransaction();
  const switchChain = useSwitchActiveWalletChain();
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const transferBdag = async (toAddress: string, amount: string) => {
    if (!account) {
      toast({ variant: "destructive", title: "Please connect your wallet first" });
      return;
    }

    setError(null);

    try {
      if (account.chain?.id !== bdagTestnet.id) {
          await switchChain(bdagTestnet);
      }

      // Manually check balance before attempting transaction
      const balance = await getWalletBalance({
        client,
        chain: bdagTestnet,
        address: account.address,
      });

      const transactionValueWei = toWei(amount);

      if (balance.value < transactionValueWei) {
        toast({
          variant: "destructive",
          title: "Insufficient Funds",
          description: "You do not have enough BDAG to complete this transaction. Please use the faucet to get test funds: https://primordial.bdagscan.com/faucet",
        });
        return;
      }

      const transaction = prepareTransaction({
        to: toAddress,
        value: transactionValueWei,
        chain: bdagTestnet,
        client: client,
      });

      await sendTransaction(transaction, {
        onSuccess: () => {
          toast({
            title: "Transaction Successful!",
            description: `Successfully sent ${amount} BDAG.`,
          });
        },
        onError: (err) => {
          console.error("Transaction Error:", err);
          setError(err.message || "An unknown error occurred during the transaction.");
          toast({
            variant: "destructive",
            title: "Transaction Failed",
            description: err.message || "Could not complete the transaction.",
          });
        }
      });
    } catch (e) {
      console.error("Transfer Error:", e);
      const errorMessage = e instanceof Error ? e.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    }
  };

  return {
    transferBdag,
    isTransferring: isPending,
    error,
  };
}
