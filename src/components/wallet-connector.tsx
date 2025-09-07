
'use client';

import React, { useState, useEffect } from 'react';
import {
  useConnect,
  useActiveAccount,
  useDisconnect,
  useActiveWallet,
  useWalletBalance,
  useSwitchActiveWalletChain
} from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "@/lib/thirdweb";
import { bdagTestnet } from '@/lib/chains';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Loader2, Check, Power, Eye, EyeOff } from 'lucide-react';

export const WalletConnector = () => {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const switchChain = useSwitchActiveWalletChain();
  const [isConnecting, setIsConnecting] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const { toast } = useToast();

  const { data: balance } = useWalletBalance({
    client,
    chain: bdagTestnet,
    address: account?.address,
  });

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const metamaskWallet = createWallet("io.metamask");
      
      await connect(async () => {
        await metamaskWallet.connect({ client });
        // After connecting, we try to switch chain
        try {
            if (wallet && wallet.getChain()?.id !== bdagTestnet.id) {
                await switchChain(bdagTestnet);
            }
            toast({ title: 'Connected!', description: 'Switched to BlockDAG Testnet.' });
        } catch (switchError) {
            console.error("Failed to switch to BDAG network:", switchError);
            toast({ variant: 'destructive', title: 'Network Switch Failed', description: 'Could not switch to BlockDAG Testnet automatically.' });
        }
        return metamaskWallet;
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({ variant: 'destructive', title: 'Connection Failed', description: error instanceof Error ? error.message : 'An unknown error occurred.' });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      if (wallet) {
        await disconnect(wallet);
        toast({ title: 'Wallet Disconnected' });
      }
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      toast({ variant: 'destructive', title: 'Disconnect Failed' });
    }
  };

  const toggleBalance = () => {
    setShowBalance(!showBalance);
  };
  
  if (account) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-md border border-primary/20 bg-card/80 p-2 text-sm">
           <Check className="text-green-500"/>
           <div className="flex flex-col">
              <span className="font-mono">{account.address.slice(0, 6)}...{account.address.slice(-4)}</span>
              <span className="text-xs text-muted-foreground">BlockDAG Testnet</span>
              {showBalance && balance && (
                <span className="text-xs font-mono">{parseFloat(balance.displayValue).toFixed(4)} {balance.symbol}</span>
              )}
           </div>
           <Button variant="ghost" size="icon" className="h-6 w-6" onClick={toggleBalance}>
             {showBalance ? <EyeOff /> : <Eye />}
           </Button>
        </div>
        <Button variant="destructive" size="icon" onClick={handleDisconnect} title="Disconnect Wallet">
            <Power />
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleConnect}
      disabled={isConnecting}
      className="bg-orange-500 hover:bg-orange-600 text-white font-bold neon-glow"
    >
      {isConnecting ? <Loader2 className="animate-spin" /> : '🦊'}
      {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
    </Button>
  );
};
