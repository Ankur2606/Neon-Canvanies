
'use client';

import React, { useState } from 'react';
import { useActiveAccount, useSendTransaction } from 'thirdweb/react';
import { prepareContractCall, toWei } from 'thirdweb';
import { getContract } from 'thirdweb/contract';
import { client } from '@/lib/thirdweb';
import { bdagTestnet } from '@/lib/chains';
import { useCredits } from '@/context/credits-context';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// IMPORTANT: Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x4019a6AB244D9A0129a53195239a7b7E09541244";

const contract = getContract({ 
  client, 
  chain: bdagTestnet, 
  address: CONTRACT_ADDRESS 
});

const PLANS = [
  { name: "Apprentice", bdag: 1, credits: 10,  gradient: "from-purple-500 to-indigo-600" },
  { name: "Artisan",    bdag: 5, credits: 55,  gradient: "from-cyan-500 to-blue-600" },
  { name: "Master",     bdag: 10, credits: 120, gradient: "from-yellow-400 to-orange-500" },
];

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ open, onOpenChange }) => {
  const account = useActiveAccount();
  const { rechargeCredits } = useCredits();
  const { toast } = useToast();
  const { mutate: sendTransaction, isPending } = useSendTransaction();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleBuy = async (plan: typeof PLANS[0]) => {
    if (!account) {
      toast({ variant: 'destructive', title: 'Wallet Not Connected' });
      return;
    }
    setLoadingPlan(plan.name);

    try {
      const transaction = prepareContractCall({ 
        contract, 
        method: "buyCredits", 
        // Note: The example contract's `buyCredits` takes `msg.value` (native currency), not a BDAG token amount.
        // We'll send BDAG as the transaction value.
        params: [], // The contract method takes no params, it uses msg.value
        value: toWei(plan.bdag.toString()),
      });

      await sendTransaction(transaction, {
        onSuccess: () => {
          rechargeCredits(plan.credits);
          toast({
            title: 'Purchase Successful!',
            description: `You've added ${plan.credits} credits to your account.`,
          });
          onOpenChange(false);
        },
        onError: (error) => {
          console.error("Transaction Error:", error);
          toast({
            variant: 'destructive',
            title: 'Transaction Failed',
            description: error.message || 'An unknown error occurred.',
          });
        }
      });
    } catch (e) {
      console.error("Purchase Error:", e);
      toast({
        variant: 'destructive',
        title: 'Purchase Error',
        description: e instanceof Error ? e.message : 'An unexpected error occurred.',
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-slate-900 border-primary/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-glow-accent mb-2">
            Out of Credits!
          </DialogTitle>
          <DialogDescription className="text-center text-lg text-slate-400">
            Recharge your creative energy. Purchase a credit pack with BDAG to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-3 gap-6 py-6">
          {PLANS.map((plan) => {
            const isLoading = loadingPlan === plan.name;
            return (
              <div
                key={plan.name}
                className={cn(
                  'rounded-xl p-6 text-center text-white flex flex-col items-center shadow-2xl border border-white/10 transition-all duration-300 hover:border-white/30 hover:scale-105',
                  plan.gradient
                )}
              >
                <h3 className="font-bold mb-2 text-xl tracking-wider">{plan.name}</h3>
                <p className="text-6xl font-extrabold py-4 flex items-center gap-3">
                  <svg className="w-8 h-8 opacity-80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5l4.243 4.243-2.122 2.121-2.12-2.12-2.122 2.12-2.121-2.121L12 .5zm7.778 6.061l-2.12 2.121 2.12 2.122 2.122-2.121-2.121-2.122zM4.222 6.561L2.1 8.682l2.122 2.121 2.12-2.12-2.12-2.122zm7.778 2.121L7.757 12l4.243 4.243L16.243 12l-4.243-3.318zM12 14.121l-2.12-2.121-2.122 2.12 4.242 4.243 4.243-4.242-2.121-2.12-2.121 2.121z"></path></svg>
                  {plan.bdag}
                </p>
                <p className="mb-6 text-lg font-light">= {plan.credits} Credits</p>
                <Button
                  className="bg-white text-black rounded-full px-8 py-3 font-bold mt-auto shadow-lg hover:bg-yellow-300 transition-transform hover:scale-105 w-full"
                  disabled={isPending || isLoading}
                  onClick={() => handleBuy(plan)}
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : "Buy Now"}
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
