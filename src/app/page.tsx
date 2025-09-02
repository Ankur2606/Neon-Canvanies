'use client';

import type { FC } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { generateAnimeImage, type GenerateAnimeImageInput } from '@/ai/flows/generate-anime-image';
import { useToast } from "@/hooks/use-toast";
import { DrawingCanvas, type DrawingCanvasRef } from '@/components/drawing-canvas';
import { Toolbar } from '@/components/toolbar';
import { WelcomeDialog } from '@/components/welcome-dialog';
import { ResultDialog } from '@/components/result-dialog';
import { useLocalStorage } from '@/hooks/use-local-storage';

export type Tool = 'brush' | 'eraser';
export type AnimeStyle = 'classic' | 'cyberpunk' | 'fantasy' | 'chibi';

const NeonCanvasPage: FC = () => {
  const { toast } = useToast();
  const [tool, setTool] = useLocalStorage<Tool>('neon-canvas-tool', 'brush');
  const [color, setColor] = useLocalStorage<string>('neon-canvas-color', '#FF32F0');
  const [brushSize, setBrushSize] = useLocalStorage<number>('neon-canvas-brushSize', 10);
  const [opacity, setOpacity] = useLocalStorage<number>('neon-canvas-opacity', 1);
  const [animeStyle, setAnimeStyle] = useState<AnimeStyle>('cyberpunk');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isWelcomeOpen, setWelcomeOpen] = useState(false);
  
  const canvasRef = useRef<DrawingCanvasRef>(null);

  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('neon-canvas-visited');
    if (isFirstVisit) {
      setWelcomeOpen(true);
      localStorage.setItem('neon-canvas-visited', 'true');
    }
  }, []);

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
    <>
      <WelcomeDialog open={isWelcomeOpen} onOpenChange={setWelcomeOpen} />
      <ResultDialog 
        open={!!generatedImage} 
        onOpenChange={(isOpen) => !isOpen && setGeneratedImage(null)}
        imageUrl={generatedImage}
      />
      
      <div className="h-screen w-screen bg-background font-body text-foreground flex flex-col md:flex-row overflow-hidden">
        <Toolbar
          tool={tool}
          setTool={setTool}
          color={color}
          setColor={setColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          opacity={opacity}
          setOpacity={setOpacity}
          animeStyle={animeStyle}
          setAnimeStyle={setAnimeStyle}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
          onClear={handleClear}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onExport={handleExport}
          onImport={handleImport}
        />
        <main className="flex-1 relative bg-black/20 h-full w-full">
          <DrawingCanvas
            ref={canvasRef}
            tool={tool}
            color={color}
            brushSize={brushSize}
            opacity={opacity}
          />
        </main>
      </div>
    </>
  );
};

export default NeonCanvasPage;
