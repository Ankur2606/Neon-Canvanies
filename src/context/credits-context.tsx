
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useActiveAccount } from "thirdweb/react";

const FREE_CREDITS = 2;

interface CreditsContextType {
  credits: number;
  spendCredits: (amount: number) => void;
  rechargeCredits: (amount: number) => void;
  syncCreditsFromWallet: () => void;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider = ({ children }: { children: ReactNode }) => {
  const account = useActiveAccount();
  const [credits, setCredits] = useState<number>(0);

  const getStorageKey = useCallback(() => {
    return account ? `neon-credits-${account.address}` : null;
  }, [account]);

  // Sync from localStorage whenever account changes
  useEffect(() => {
    const key = getStorageKey();
    if (key) {
      const stored = window.localStorage.getItem(key);
      if (stored === null) {
        // First time login for this account, grant free credits
        setCredits(FREE_CREDITS);
        window.localStorage.setItem(key, String(FREE_CREDITS));
      } else {
        setCredits(Number(stored));
      }
    } else {
      // No account connected
      setCredits(0);
    }
  }, [account, getStorageKey]);

  // Update localStorage whenever credits change
  useEffect(() => {
    const key = getStorageKey();
    if (key) {
        window.localStorage.setItem(key, String(credits));
    }
  }, [credits, getStorageKey]);

  const spendCredits = (amount: number) => {
    setCredits((prev) => Math.max(prev - amount, 0));
  };

  const rechargeCredits = (amount: number) => {
    setCredits((prev) => prev + amount);
  };

  const syncCreditsFromWallet = useCallback(() => {
    const key = getStorageKey();
    if (key) {
      const stored = window.localStorage.getItem(key);
      setCredits(stored ? Number(stored) : FREE_CREDITS);
    } else {
        setCredits(0);
    }
  }, [getStorageKey]);

  return (
    <CreditsContext.Provider value={{ credits, spendCredits, rechargeCredits, syncCreditsFromWallet }}>
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
