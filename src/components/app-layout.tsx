
'use client';

import type { Dispatch, FC, SetStateAction, ReactNode } from 'react';
import { useState } from 'react';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { Toolbar } from '@/components/toolbar';
import { AIPanel } from '@/components/ai-panel';
import { Header } from '@/components/header';
import type { Tool, AnimeStyle } from '@/app/page';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  tool: Tool;
  setTool: Dispatch<SetStateAction<Tool>>;
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  brushSize: number;
  setBrushSize: Dispatch<SetStateAction<number>>;
  opacity: number;
  setOpacity: Dispatch<SetStateAction<number>>;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  animeStyle: AnimeStyle;
  setAnimeStyle: Dispatch<SetStateAction<AnimeStyle>>;
  isGenerating: boolean;
  onGenerate: () => void;
  generatedImage: string | null;
}

const MobileAIPanelDialog = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Sparkles />
      </Button>
      <DialogContent className="h-full max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>AI Generation</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export const AppLayout: FC<AppLayoutProps> = ({
  children,
  tool,
  setTool,
  color,
  setColor,
  brushSize,
  setBrushSize,
  opacity,
  setOpacity,
  onClear,
  onUndo,
  onRedo,
  onExport,
  onImport,
  animeStyle,
  setAnimeStyle,
  isGenerating,
  onGenerate,
  generatedImage,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="h-screen w-screen bg-background font-body text-foreground flex overflow-hidden">
      <Sidebar collapsible="icon" className="md:w-80">
        <Toolbar
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          opacity={opacity}
          setOpacity={setOpacity}
          onClear={onClear}
          onUndo={onUndo}
          onRedo={onRedo}
          onExport={onExport}
          onImport={onImport}
        />
      </Sidebar>
      
      <SidebarInset className="flex-1 flex flex-col relative bg-black/20">
          <Header>
            {isMobile && (
              <MobileAIPanelDialog>
                  <AIPanel
                    animeStyle={animeStyle}
                    setAnimeStyle={setAnimeStyle}
                    isGenerating={isGenerating}
                    onGenerate={onGenerate}
                    generatedImage={generatedImage}
                  />
              </MobileAIPanelDialog>
            )}
          </Header>
          <main className="flex-1 relative">
            {children}
          </main>
      </SidebarInset>

      <div className="hidden md:flex">
        <AIPanel
          animeStyle={animeStyle}
          setAnimeStyle={setAnimeStyle}
          isGenerating={isGenerating}
          onGenerate={onGenerate}
          generatedImage={generatedImage}
        />
      </div>
    </div>
  );
};
