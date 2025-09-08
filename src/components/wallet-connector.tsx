
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
import { Loader2, Check, Power, Eye, EyeOff, Diamond } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useCredits } from '@/context/credits-context';

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

const ConnectedDisplay = ({ onDisconnect, onOpenPricing }: { onDisconnect: () => void, onOpenPricing: () => void }) => {
  const account = useActiveAccount();
  const [showBalance, setShowBalance] = useState(false);
  const { credits } = useCredits();

  const { data: balance } = useWalletBalance({
    client,
    chain: bdagTestnet,
    address: account?.address,
  });

  if (!account) return null;

  return (
      <div className="flex w-full items-center gap-2 rounded-md border border-primary/20 bg-card/80 p-2 text-sm">
         <div className="flex flex-col flex-1 gap-1">
            <span className="font-mono text-xs md:text-sm break-all flex items-center gap-2">
              <Check className="text-green-500 size-4 shrink-0"/> {account.address}
            </span>
            <div className="text-xs text-muted-foreground flex items-center justify-between gap-4 pl-6">
              <span>BlockDAG Testnet</span>
              <button
                onClick={onOpenPricing}
                className="font-mono flex items-center gap-1.5 cursor-pointer hover:text-accent transition-colors"
                title="Recharge Credits"
              >
                <Diamond className="size-3 text-cyan-400"/>
                {credits} Credits
              </button>
            </div>
         </div>
         <Button variant="destructive" size="icon" onClick={onDisconnect} title="Disconnect Wallet" className="h-8 w-8 shrink-0">
              <Power />
          </Button>
      </div>
  )
}

export const WalletConnector = ({ onOpenPricing }: { onOpenPricing: () => void }) => {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const switchChain = useSwitchActiveWalletChain();
  const { syncCreditsFromWallet } = useCredits();

  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isMobileDialogOpen, setMobileDialogOpen] = useState(false);

  useEffect(() => {
    syncCreditsFromWallet();
  }, [account, syncCreditsFromWallet]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const metamaskWallet = createWallet("io.metamask");
      
      const connectedWallet = await connect(async () => {
        await metamaskWallet.connect({ client });
        if (metamaskWallet.getChain()?.id !== bdagTestnet.id) {
          await metamaskWallet.switchChain(bdagTestnet);
        }
        return metamaskWallet;
      });

      if (connectedWallet) {
        toast({ title: 'Connected!', description: 'Wallet connected to BlockDAG Testnet.' });
        if (isMobile) setMobileDialogOpen(false);
      }
      
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      let description = 'An unknown error occurred.';
      if (error instanceof Error) {
        if (error.message.includes('switch chain')) {
          description = 'Could not switch to BlockDAG Testnet automatically. Please do it manually in MetaMask.'
        } else {
          description = error.message;
        }
      }
      toast({ variant: 'destructive', title: 'Connection Failed', description });
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
              <ConnectedDisplay onDisconnect={handleDisconnect} onOpenPricing={onOpenPricing} />
            ) : (
              <ConnectButton isConnecting={isConnecting} onConnect={handleConnect} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  
  if (account) {
    return <ConnectedDisplay onDisconnect={handleDisconnect} onOpenPricing={onOpenPricing} />;
  }

  return <ConnectButton isConnecting={isConnecting} onConnect={handleConnect} />;
};
