
'use client';

import { FC, useState, useRef, useCallback } from 'react';
import { generateAnimeImage, type GenerateAnimeImageInput } from '@/ai/flows/generate-anime-image';
import { useToast } from "@/hooks/use-toast";
import { DrawingCanvas, type DrawingCanvasRef } from '@/components/drawing-canvas';
import { AppLayout } from '@/components/app-layout';
import { WelcomeDialog } from '@/components/welcome-dialog';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useCredits } from '@/context/credits-context';
import { PricingModal } from '@/components/pricing-modal';

export type Tool = 'brush' | 'eraser';
export type AnimeStyle = 'classic' | 'cyberpunk' | 'fantasy' | 'chibi' | 'realistic';
export type GenerationMode = 'style' | 'prompt';

const NeonCanvasPage: FC = () => {
  const { toast } = useToast();
  const { credits, spendCredits } = useCredits();
  const [tool, setTool] = useState<Tool>('brush');
  const [color, setColor] = useState<string>('#FF32F0');
  const [brushSize, setBrushSize] = useState<number>(10);
  const [opacity, setOpacity] = useState<number>(1);
  const [animeStyle, setAnimeStyle] = useState<AnimeStyle>('cyberpunk');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [generationMode, setGenerationMode] = useState<GenerationMode>('style');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showWelcomeDialog, setShowWelcomeDialog] = useLocalStorage('showWelcomeDialog', true);
  const [showPricingModal, setShowPricingModal] = useState(false);
  
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
      link.download = 'neon-canvanies-creation.png';
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
    if (credits <= 0) {
      setShowPricingModal(true);
      toast({
        variant: 'destructive',
        title: 'Out of Credits',
        description: 'Please purchase a credit pack to continue generating images.',
      });
      return;
    }

    const drawingDataUri = canvasRef.current?.exportAsPNG();
    if (!drawingDataUri || canvasRef.current?.isCanvasEmpty()) {
      toast({
        variant: 'destructive',
        title: 'Canvas is empty',
        description: 'Please draw something on the canvas before generating an image.',
      });
      return;
    }

    if (generationMode === 'prompt' && !customPrompt.trim()) {
      toast({
        variant: 'destructive',
        title: 'Prompt is empty',
        description: 'Please enter a prompt for the Dream-Mode generation.',
      });
      return;
    }
    
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const input: GenerateAnimeImageInput = { 
        drawingDataUri, 
        animeStyle, 
        customPrompt: generationMode === 'prompt' ? customPrompt : undefined,
      };
      const result = await generateAnimeImage(input);
      if (!result?.animeImageDataUri) {
          throw new Error('The AI did not return an image. This might be due to a content policy violation or a temporary issue. Please try again with a different drawing.');
      }
      setGeneratedImage(result.animeImageDataUri);
      spendCredits(1); // Decrement credits on success
      toast({
        title: "Success!",
        description: "Your masterpiece has been generated. You have " + (credits - 1) + " credits remaining."
      });

    } catch (error) {
      console.error('AI generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <WelcomeDialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog} />
      <PricingModal open={showPricingModal} onOpenChange={setShowPricingModal} />
      <AppLayout
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
        animeStyle={animeStyle}
        setAnimeStyle={setAnimeStyle}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
        generatedImage={generatedImage}
        generationMode={generationMode}
        setGenerationMode={setGenerationMode}
        customPrompt={customPrompt}
        setCustomPrompt={setCustomPrompt}
        onOpenPricing={() => setShowPricingModal(true)}
      >
        <DrawingCanvas
            ref={canvasRef}
            tool={tool}
            color={color}
            brushSize={brushSize}
            opacity={opacity}
        />
      </AppLayout>
    </>
  );
};

export default NeonCanvasPage;
