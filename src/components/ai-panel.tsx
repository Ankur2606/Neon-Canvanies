
'use client';

import { Dispatch, FC, SetStateAction, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Wand2, Sparkles, Loader2, Download } from 'lucide-react';
import type { AnimeStyle, GenerationMode } from '@/app/page';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { suggestBetterPrompt } from '@/ai/flows/suggest-better-prompt';

interface AIPanelProps {
  animeStyle: AnimeStyle;
  setAnimeStyle: Dispatch<SetStateAction<AnimeStyle>>;
  isGenerating: boolean;
  onGenerate: () => void;
  generatedImage: string | null;
  generationMode: GenerationMode;
  setGenerationMode: Dispatch<SetStateAction<GenerationMode>>;
  customPrompt: string;
  setCustomPrompt: Dispatch<SetStateAction<string>>;
}

const styleOptions: { value: AnimeStyle; label: string }[] = [
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'classic', label: 'Anime' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'chibi', label: 'Chibi' },
    { value: 'realistic', label: 'Realistic' },
]

export const AIPanel: FC<AIPanelProps> = ({
  animeStyle,
  setAnimeStyle,
  isGenerating,
  onGenerate,
  generatedImage,
  generationMode,
  setGenerationMode,
  customPrompt,
  setCustomPrompt
}) => {
  const { toast } = useToast();
  const [isRefining, setIsRefining] = useState(false);

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'neon-canvanies-ai-art.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefinePrompt = async () => {
    if (!customPrompt.trim()) return;
    setIsRefining(true);
    try {
      const originalPrompt = customPrompt;
      const refinedPrompt = await suggestBetterPrompt({ prompt: originalPrompt });
      
      if (refinedPrompt && refinedPrompt !== originalPrompt) {
        setCustomPrompt(refinedPrompt);
        toast({
          title: "Prompt Refined!",
          description: "Your prompt has been enhanced by AI.",
        });
      } else {
        toast({
            title: "Already Perfect!",
            description: "The AI couldn't improve your prompt, but you can still use it!",
        });
      }

    } catch (error) {
      console.error("Prompt refinement failed:", error);
      toast({
        variant: "destructive",
        title: "Refinement Failed",
        description: "Could not refine the prompt at this time.",
      });
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <aside className="w-full h-full bg-card/50 backdrop-blur-sm flex-col z-10 gap-4 md:flex md:w-96 md:border-l md:border-primary/20">
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4 md:p-6">
          <h2 className="text-xl font-bold text-glow-accent text-center hidden md:block">AI Generation</h2>
          
          <Tabs value={generationMode} onValueChange={(v) => setGenerationMode(v as GenerationMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="style">AI Styles</TabsTrigger>
              <TabsTrigger value="prompt">Dream-Mode</TabsTrigger>
            </TabsList>
            <TabsContent value="style" className="space-y-4 pt-4">
              <Label className="text-glow-accent">
                Select a Style
              </Label>
              <Select value={animeStyle} onValueChange={(v: AnimeStyle) => setAnimeStyle(v)}>
                  <SelectTrigger className="w-full neon-glow">
                      <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                      {styleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </TabsContent>
            <TabsContent value="prompt" className="space-y-4 pt-4">
               <div className="space-y-2">
                <Label htmlFor="custom-prompt" className="text-glow-accent">
                  Describe Your Vision
                </Label>
                <Textarea 
                  id="custom-prompt" 
                  placeholder="e.g., A lone samurai contemplating under a cherry blossom tree, neon city in the background..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[100px] text-base"
                />
               </div>
               <Button 
                variant="outline" 
                className="w-full" 
                disabled={!customPrompt.trim() || isRefining}
                onClick={handleRefinePrompt}
                >
                {isRefining ? <Loader2 className="mr-2 animate-spin"/> : <Wand2 className="mr-2"/>}
                Refine with AI
               </Button>
            </TabsContent>
          </Tabs>


          <Button
            onClick={onGenerate}
            disabled={isGenerating || isRefining}
            className="w-full neon-glow-accent h-12 text-lg"
          >
            {isGenerating ? 'Generating...' : <><Sparkles className="mr-2" />Generate Image</>}
          </Button>

          <div className="flex-1 flex flex-col gap-4">
            <Label className="text-glow-accent">Result</Label>
            <div className="aspect-square w-full relative flex items-center justify-center rounded-md overflow-hidden border-2 border-primary/20 bg-black/20">
                {isGenerating && <Loader2 className="h-16 w-16 animate-spin text-primary" />}
                {!isGenerating && generatedImage && (
                    <Image
                    src={generatedImage}
                    alt="Generated AI anime"
                    fill
                    className="object-contain"
                    />
                )}
                {!isGenerating && !generatedImage && (
                    <div className="text-center text-muted-foreground p-4">
                        <Sparkles className="mx-auto h-10 w-10 mb-2"/>
                        <p>Your generated image will appear here.</p>
                    </div>
                )}
            </div>
            <Button onClick={handleDownload} disabled={!generatedImage || isGenerating} className="w-full neon-glow h-12 text-lg">
                <Download className="mr-2 h-4 w-4" />
                Download
            </Button>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};
