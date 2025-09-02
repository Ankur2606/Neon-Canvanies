
'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSidebar } from '@/hooks/use-sidebar';
import { PanelLeft, X } from 'lucide-react';

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
    return (
        <header className="absolute top-2 left-2 z-20 flex items-center gap-2">
            <MobileSidebarToggle />
            <div className="hidden md:block">
                <SidebarTrigger />
            </div>
            {children}
        </header>
    )
}
