
'use client';

import type { FC } from 'react';
import { useState, useRef, useCallback } from 'react';
import { generateAnimeImage, type GenerateAnimeImageInput } from '@/ai/flows/generate-anime-image';
import { useToast } from "@/hooks/use-toast";
import { DrawingCanvas, type DrawingCanvasRef } from '@/components/drawing-canvas';
import { Sidebar, SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Toolbar } from '@/components/toolbar';
import { AIPanel } from '@/components/ai-panel';
import { Button } from '@/components/ui/button';
import { PanelLeft, X } from 'lucide-react';
import { useSidebar } from '@/hooks/use-sidebar';

export type Tool = 'brush' | 'eraser';
export type AnimeStyle = 'classic' | 'cyberpunk' | 'fantasy' | 'chibi';

const MobileSidebarToggle = () => {
  const { open, setOpen } = useSidebar();
  return (
    <Button 
      variant="ghost" 
      size="icon"
      className="md:hidden fixed top-2 left-2 z-20 bg-card/50 backdrop-blur-sm"
      onClick={() => setOpen(!open)}
    >
      {open ? <X /> : <PanelLeft />}
    </Button>
  );
};


const NeonCanvasPage: FC = () => {
  const { toast } = useToast();
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState<string>('#FF32F0');
  const [brushSize, setBrushSize] = useState<number>(10);
  const [opacity, setOpacity] = useState<number>(1);
  const [animeStyle, setAnimeStyle] = useState<AnimeStyle>('cyberpunk');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const canvasRef = useRef<DrawingCanvasRef>(null);

  const handleClear = useCallback(() => {
    canvasRef.current?.clearCanvas();
  }, []);

  const handleUndo = useCallback(() => {
    canvasRef.current?.undo();
  }, []);

  const handleRedo = useCallback(() => {
    canvasRef.current?.redo();
  }, []);
  
  const handleExport = useCallback(() => {
    const dataUrl = canvasRef.current?.exportAsPNG();
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = 'neon-canvas-creation.png';
      link.href = dataUrl;
      link.click();
    }
  }, []);
  
  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        canvasRef.current?.importImage(img);
      }
      img.src = e.target?.result as string;
    }
    reader.readAsDataURL(file);
  }

  const handleGenerate = async () => {
    const drawingDataUri = canvasRef.current?.exportAsPNG();
    if (!drawingDataUri || canvasRef.current?.isCanvasEmpty()) {
      toast({
        variant: 'destructive',
        title: 'Canvas is empty',
        description: 'Draw something on the canvas before generating.',
      });
      return;
    }
    
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const input: GenerateAnimeImageInput = { drawingDataUri, animeStyle };
      const result = await generateAnimeImage(input);
      setGeneratedImage(result.animeImageDataUri);
    } catch (error) {
      console.error('AI generation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate the image. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="h-screen w-screen bg-background font-body text-foreground flex overflow-hidden">
        <MobileSidebarToggle />
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
            onClear={handleClear}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onExport={handleExport}
            onImport={handleImport}
          />
        </Sidebar>
        
        <SidebarInset className="flex-1 flex flex-col relative bg-black/20">
            <header className="absolute top-2 right-2 z-10">
                 <SidebarTrigger className="hidden md:flex" />
            </header>
            <main className="flex-1 relative">
                <DrawingCanvas
                    ref={canvasRef}
                    tool={tool}
                    color={color}
                    brushSize={brushSize}
                    opacity={opacity}
                />
            </main>
        </SidebarInset>

        <AIPanel
          animeStyle={animeStyle}
          setAnimeStyle={setAnimeStyle}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
          generatedImage={generatedImage}
        />
      </div>
    </SidebarProvider>
  );
};

export default NeonCanvasPage;
