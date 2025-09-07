import { useState, useEffect } from "react";
import { CREDIT_PLANS } from "../components/credits-modal";

const FREE_CREDITS = 49; // $5 worth

export function useCredits() {
  const [credits, setCredits] = useState<number>(0);

  // On mount, sync credits from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem("user_credits");
      const walletConnected = window.localStorage.getItem("wallet_connected");
      if (!walletConnected) {
        setCredits(0);
      } else {
        setCredits(stored ? Number(stored) : FREE_CREDITS);
      }
    }
  }, []);

  // Always refresh credits from localStorage after each change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem("user_credits", String(credits));
    }
  }, [credits]);
  
  const spendCredits = (amount: number) => {
    setCredits((prev) => Math.max(prev - amount, 0));
  };

  // Recharge credits, enforcing plan limit
  const rechargeCredits = (amount: number, planName?: string) => {
    let maxCredits = FREE_CREDITS;
    if (planName) {
      const plan = CREDIT_PLANS.find(p => p.name === planName);
      if (plan) maxCredits = plan.tokens;
    }
    setCredits((prev) => Math.min(prev + amount, maxCredits));
    if (isClient) {
      window.localStorage.setItem("wallet_connected", "true");
    }
  };

  // Reset credits to Starter plan
  const resetCredits = () => {
    setCredits(CREDIT_PLANS[0].tokens);
    if (isClient) {
      window.localStorage.setItem("user_credits", String(CREDIT_PLANS[0].tokens));
      window.localStorage.setItem("wallet_connected", "true");
    }
  };
  
  // Sync credits from wallet/localStorage
  const syncCreditsFromWallet = () => {
    if (isClient) {
      const walletConnected = window.localStorage.getItem("wallet_connected");
      if (!walletConnected) {
        setCredits(0);
        return;
      }
      const stored = window.localStorage.getItem("user_credits");
      setCredits(stored ? Number(stored) : FREE_CREDITS);
    }
  };

  return { credits, spendCredits, rechargeCredits, resetCredits, syncCreditsFromWallet };
}
