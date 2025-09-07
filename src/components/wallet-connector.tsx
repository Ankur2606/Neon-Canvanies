
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
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const ConnectButton = ({isConnecting, onConnect}: {isConnecting: boolean, onConnect: () => void}) => (
    <Button 
      onClick={onConnect}
      disabled={isConnecting}
      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold neon-glow"
    >
      {isConnecting ? <Loader2 className="animate-spin" /> : '🦊'}
      {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
    </Button>
);

const ConnectedDisplay = ({ onDisconnect }: { onDisconnect: () => void }) => {
  const account = useActiveAccount();
  const [showBalance, setShowBalance] = useState(false);
  const { data: balance } = useWalletBalance({
    client,
    chain: bdagTestnet,
    address: account?.address,
  });

  if (!account) return null;

  return (
      <div className="flex w-full items-center gap-2 rounded-md border border-primary/20 bg-card/80 p-2 text-sm">
         <Check className="text-green-500"/>
         <div className="flex flex-col flex-1">
            <span className="font-mono text-xs md:text-sm break-all">{account.address}</span>
            <span className="text-xs text-muted-foreground">BlockDAG Testnet</span>
            {showBalance && balance && (
              <span className="text-xs font-mono">{parseFloat(balance.displayValue).toFixed(4)} {balance.symbol}</span>
            )}
         </div>
         <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setShowBalance(p => !p)}>
           {showBalance ? <EyeOff /> : <Eye />}
         </Button>
         <Button variant="destructive" size="icon" onClick={onDisconnect} title="Disconnect Wallet" className="h-8 w-8 shrink-0">
              <Power />
          </Button>
      </div>
  )
}

export const WalletConnector = () => {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const switchChain = useSwitchActiveWalletChain();
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isMobileDialogOpen, setMobileDialogOpen] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const metamaskWallet = createWallet("io.metamask");
      
      await connect(async () => {
        await metamaskWallet.connect({ client });
        try {
            if (wallet && wallet.getChain()?.id !== bdagTestnet.id) {
                await switchChain(bdagTestnet);
            }
            toast({ title: 'Connected!', description: 'Switched to BlockDAG Testnet.' });
            if (isMobile) setMobileDialogOpen(false);
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

  if (isMobile) {
    return (
      <Dialog open={isMobileDialogOpen} onOpenChange={setMobileDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="border-orange-500/50 text-orange-500 hover:bg-orange-500/10 hover:text-orange-400">
            🦊
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wallet</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {account ? (
              <ConnectedDisplay onDisconnect={handleDisconnect} />
            ) : (
              <ConnectButton isConnecting={isConnecting} onConnect={handleConnect} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  
  if (account) {
    return <ConnectedDisplay onDisconnect={handleDisconnect} />;
  }

  return <ConnectButton isConnecting={isConnecting} onConnect={handleConnect} />;
};
