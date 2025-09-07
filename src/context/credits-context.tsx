import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const FREE_CREDITS = 49;

interface CreditsContextType {
  credits: number;
  spendCredits: (amount: number) => void;
  rechargeCredits: (amount: number) => void;
  resetCredits: () => void;
  syncCreditsFromWallet: () => void;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider = ({ children }: { children: ReactNode }) => {
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const walletConnected = window.localStorage.getItem("wallet_connected");
      if (!walletConnected) {
        setCredits(0);
        return;
      }
      const stored = window.localStorage.getItem("user_credits");
      setCredits(stored ? Number(stored) : FREE_CREDITS);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("user_credits", String(credits));
    }
  }, [credits]);

  const spendCredits = (amount: number) => {
    setCredits((prev) => Math.max(prev - amount, 0));
  };

  const rechargeCredits = (amount: number) => {
    setCredits((prev) => prev + amount);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("wallet_connected", "true");
    }
  };

  const resetCredits = () => {
    setCredits(FREE_CREDITS);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("wallet_connected", "true");
    }
  };

  const syncCreditsFromWallet = () => {
    if (typeof window !== "undefined") {
      const walletConnected = window.localStorage.getItem("wallet_connected");
      if (!walletConnected) {
        setCredits(0);
        return;
      }
      const stored = window.localStorage.getItem("user_credits");
      setCredits(stored ? Number(stored) : FREE_CREDITS);
    }
  };

  return (
    <CreditsContext.Provider value={{ credits, spendCredits, rechargeCredits, resetCredits, syncCreditsFromWallet }}>
      {children}
    </CreditsContext.Provider>
  );
};

export function useCredits() {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return context;
}
