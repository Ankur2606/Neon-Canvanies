
'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSidebar } from '@/hooks/use-sidebar';
import { PanelLeft, X } from 'lucide-react';
import { WalletConnector } from './wallet-connector';
import { useCredits } from '@/hooks/use-credits';

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

export const Header = ({ children }: { children?: React.ReactNode }) => {
  const { credits } = useCredits();
  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <MobileSidebarToggle />
        <div className="hidden md:block">
          <SidebarTrigger />
        </div>
        <div className="hidden md:block">
          <WalletConnector />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="px-3 py-1 bg-gray-100 rounded text-sm font-semibold text-blue-700">
          Credits: {credits}
        </div>
        {children}
        <div className="md:hidden">
          <WalletConnector />
        </div>
      </div>
    </header>
  )
}
