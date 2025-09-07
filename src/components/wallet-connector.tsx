
'use client';

import {
  useConnect,
  useActiveAccount,
  useDisconnect,
  useWalletBalance,
  useSwitchActiveWalletChain,
} from '@thirdweb-dev/react';
import { createWallet } from 'thirdweb/wallets';
import { blockdagTestnet } from '@/lib/chains';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ChevronDown, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const metamask = createWallet('io.metamask');

export const WalletConnector = () => {
  const { toast } = useToast();
  const account = useActiveAccount();
  const { connect, isConnecting, error: connectionError } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance, isLoading: isBalanceLoading, error: balanceError } = useWalletBalance({
    address: account?.address,
    chain: blockdagTestnet,
  });
  const { switchChain, isSwitching, error: switchError } = useSwitchActiveWalletChain();

  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      const connectedWallet = await connect(metamask);
      
      if (connectedWallet.getChain()?.id !== blockdagTestnet.id) {
        await switchChain(blockdagTestnet);
      }
      
      toast({
        title: 'Wallet Connected',
        description: `Connected to ${truncateAddress(connectedWallet.getAccount()?.address || '')}`,
      });
    } catch (e) {
      console.error('Connection failed:', e);
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: 'Could not connect to the wallet. Please try again.',
      });
    }
  };
  
  useEffect(() => {
    if (connectionError) {
      toast({ variant: 'destructive', title: 'Connection Error', description: connectionError.message });
    }
    if (switchError) {
      toast({ variant: 'destructive', title: 'Network Switch Error', description: switchError.message });
    }
    if (balanceError) {
        toast({ variant: 'destructive', title: 'Balance Error', description: 'Could not fetch wallet balance.' });
      }
  }, [connectionError, switchError, balanceError, toast]);

  if (isConnecting || isSwitching) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (!account) {
    return <Button onClick={handleConnect}>Connect MetaMask</Button>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {truncateAddress(account.address)}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          {blockdagTestnet.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex justify-between items-center focus:bg-transparent cursor-default">
          <span>Balance:</span>
          <span className="flex items-center gap-2">
            {isBalanceLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <>
                {isBalanceVisible ? `${Number(balance?.displayValue || 0).toFixed(4)} ${balance?.symbol}` : '****'}
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsBalanceVisible(!isBalanceVisible)}>
                    {isBalanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                </>
            )}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => disconnect(account.wallet)}>
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
