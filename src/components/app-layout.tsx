
'use client';

import type { Dispatch, FC, SetStateAction, ReactNode } from 'react';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { Toolbar } from '@/components/toolbar';
import { AIPanel } from '@/components/ai-panel';
import { Header } from '@/components/header';
import type { Tool, AnimeStyle } from '@/app/page';

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
          <Header />
          <main className="flex-1 relative">
            {children}
          </main>
      </SidebarInset>

      <AIPanel
        animeStyle={animeStyle}
        setAnimeStyle={setAnimeStyle}
        isGenerating={isGenerating}
        onGenerate={onGenerate}
        generatedImage={generatedImage}
      />
    </div>
  );
};
