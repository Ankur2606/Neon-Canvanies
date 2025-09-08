
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSidebar } from '@/hooks/use-sidebar';
import { PanelLeft, X, Users } from 'lucide-react';
import { WalletConnector } from './wallet-connector';

const MobileSidebarToggle = () => {
  const { open, setOpen } = useSidebar();
  return (
    <Button 
      variant="ghost" 
      size="icon"
      className="md:hidden"
      onClick={() => setOpen(!open)}
    >
      {open ? <X /> : <PanelLeft />}
    </Button>
  );
};

export const Header = ({ children, onOpenPricing }: { children?: React.ReactNode, onOpenPricing: () => void }) => {
    return (
        <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
                <MobileSidebarToggle />
                <div className="hidden md:block">
                    <SidebarTrigger />
                </div>
                <Link href="/marketplace">
                  <Button variant="ghost" className="hidden md:flex items-center space-x-2 hover:bg-primary/20">
                    <Users className="w-4 h-4" />
                    <span>Marketplace</span>
                  </Button>
                </Link>
                <div className="hidden md:block">
                    <WalletConnector onOpenPricing={onOpenPricing} />
                </div>
            </div>
            <div className="flex items-center gap-2">
                {children}
                <div className="md:hidden">
                    <WalletConnector onOpenPricing={onOpenPricing} />
                </div>
            </div>
        </header>
    )
}
