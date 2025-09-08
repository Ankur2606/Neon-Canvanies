import { useState } from "react";
import { useActiveAccount, useSendTransaction, useSwitchActiveWalletChain, useContract } from "thirdweb/react";
import { bdagJobPaymentContract } from "@/lib/thirdweb";
import { prepareContractCall } from "thirdweb";
import { bdagTestnet } from "@/lib/chains";

// Hook for BdagJobPayment contract interactions
export function useBdagJobPayment() {
  const account = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  const switchChain = useSwitchActiveWalletChain();
  const { contract } = useContract(bdagJobPaymentContract);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to ensure correct network
  const ensureCorrectNetwork = async () => {
    try {
      await switchChain(bdagTestnet);
    } catch (error) {
      console.error("Error switching network:", error);
      throw new Error("Please switch to BlockDAG testnet in your wallet");
    }
  };

  // Register as a designer
  const registerDesigner = async (hourlyRate: number, name: string) => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (!contract) {
      setError("Contract not loaded");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await ensureCorrectNetwork();

      const transaction = await contract.prepare("registerDesigner", [BigInt(hourlyRate), name]);
      await sendTransaction(transaction);
    } catch (error) {
      console.error("Error registering designer:", error);
      setError(error instanceof Error ? error.message : "Failed to register designer");
    } finally {
      setIsLoading(false);
    }
  };

  // Post a job
  const postJob = async (description: string, budget: number) => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (!contract) {
      setError("Contract not loaded");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await ensureCorrectNetwork();

      const transaction = await contract.prepare("postJob", [description, BigInt(budget)], {
        value: BigInt(budget),
      });
      await sendTransaction(transaction);
    } catch (error) {
      console.error("Error posting job:", error);
      setError(error instanceof Error ? error.message : "Failed to post job");
    } finally {
      setIsLoading(false);
    }
  };

  // Hire a designer
  const hireDesigner = async (jobId: number, designerAddress: string) => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (!contract) {
      setError("Contract not loaded");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await ensureCorrectNetwork();

      const transaction = await contract.prepare("hireDesigner", [BigInt(jobId), designerAddress]);
      await sendTransaction(transaction);
    } catch (error) {
      console.error("Error hiring designer:", error);
      setError(error instanceof Error ? error.message : "Failed to hire designer");
    } finally {
      setIsLoading(false);
    }
  };

  // Complete a job
  const completeJob = async (jobId: number) => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (!contract) {
      setError("Contract not loaded");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await ensureCorrectNetwork();

      const transaction = await contract.prepare("completeJob", [BigInt(jobId)]);
      await sendTransaction(transaction);
    } catch (error) {
      console.error("Error completing job:", error);
      setError(error instanceof Error ? error.message : "Failed to complete job");
    } finally {
      setIsLoading(false);
    }
  };

  // Release payment
  const releasePayment = async (jobId: number) => {
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (!contract) {
      setError("Contract not loaded");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await ensureCorrectNetwork();

      const transaction = await contract.prepare("releasePayment", [BigInt(jobId)]);
      await sendTransaction(transaction);
    } catch (error) {
      console.error("Error releasing payment:", error);
      setError(error instanceof Error ? error.message : "Failed to release payment");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerDesigner,
    postJob,
    hireDesigner,
    completeJob,
    releasePayment,
    isLoading,
    error,
  };
}
