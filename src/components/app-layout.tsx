
'use client';

import type { Dispatch, FC, SetStateAction, ReactNode } from 'react';
import { useState } from 'react';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { Toolbar } from '@/components/toolbar';
import { AIPanel } from '@/components/ai-panel';
import { Header } from '@/components/header';
import type { Tool, AnimeStyle, GenerationMode } from '@/app/page';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

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
  generationMode: GenerationMode;
  setGenerationMode: Dispatch<SetStateAction<GenerationMode>>;
  customPrompt: string;
  setCustomPrompt: Dispatch<SetStateAction<string>>;
  onOpenPricing: () => void;
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
      <DialogContent className="h-full max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle>AI Generation</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
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
  generationMode,
  setGenerationMode,
  customPrompt,
  setCustomPrompt,
  onOpenPricing,
}) => {
  const isMobile = useIsMobile();

  const aiPanelProps = {
    animeStyle,
    setAnimeStyle,
    isGenerating,
    onGenerate,
    generatedImage,
    generationMode,
    setGenerationMode,
    customPrompt,
    setCustomPrompt,
  }

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
          <Header onOpenPricing={onOpenPricing}>
            {isMobile && (
              <MobileAIPanelDialog>
                  <AIPanel {...aiPanelProps} />
              </MobileAIPanelDialog>
            )}
          </Header>
          <main className="flex-1 relative">
            {children}
          </main>
      </SidebarInset>

      <div className="hidden md:flex">
        <AIPanel {...aiPanelProps}/>
      </div>
    </div>
  );
};
