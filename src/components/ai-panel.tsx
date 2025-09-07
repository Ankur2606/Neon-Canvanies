
'use client';

import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCredits } from '@/hooks/use-credits';
import { CreditsModal, CREDIT_PLANS } from './credits-modal';
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
    if (!customPrompt.trim()) {
      return;
    }
    setIsRefining(true);
    const originalPrompt = customPrompt;
  
    try {
      // Start the AI call
      const refinedPrompt = await suggestBetterPrompt({ prompt: originalPrompt });
      console.log('AI Refinement returned:', refinedPrompt);
  
      // Check if we got a valid, *different* prompt back
      if (refinedPrompt && refinedPrompt !== originalPrompt) {
        setCustomPrompt(refinedPrompt);
        toast({
          title: "Prompt Enhanced!",
          description: "Your prompt has been improved by the AI.",
        });
      } else {
        // This case handles if the AI returns the same prompt or an error state
        toast({
          title: "Prompt is Already Perfect!",
          description: "The AI couldn't find a way to improve this prompt, but you can still use it.",
        });
      }
    } catch (error) {
      // This will catch network errors or if the flow itself throws an error
      console.error("Error during prompt refinement:", error);
      toast({
        variant: "destructive",
        title: "Refinement Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <aside className="w-full h-full bg-card/50 backdrop-blur-sm flex flex-col z-10 md:w-96 md:border-l md:border-primary/20">
      <div className="flex-shrink-0 p-4 md:p-6 md:pb-0">
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
               {/* Remove this button, as the credits logic below handles it */}
            </TabsContent>
          </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4 pt-0 md:p-6 md:pt-6">
          {/** Credits logic integration **/}
          {(() => {
            const { credits, spendCredits, rechargeCredits } = useCredits();
            const [showModal, setShowModal] = React.useState(false);
            const IMAGE_COST = 5; // 5 credits per image
            const PROMPT_COST = 2; // 2 credits per prompt
            const walletConnected = typeof window !== 'undefined' ? window.localStorage.getItem('wallet_connected') === 'true' : false;

            const handleGenerate = () => {
              if (!walletConnected) return;
              if (credits < IMAGE_COST) {
                setShowModal(true);
                return;
              }
              spendCredits(IMAGE_COST);
              onGenerate();
            };

            const handleRecharge = (plan: { tokens: number; }) => {
              rechargeCredits(plan.tokens);
              setShowModal(false);
            };

            return <>
              <Button
                onClick={handleGenerate}
                disabled={!walletConnected || isGenerating || isRefining || credits < IMAGE_COST}
                className="w-full neon-glow-accent h-12 text-lg"
              >
                {!walletConnected
                  ? 'Connect wallet to generate image'
                  : isGenerating
                    ? 'Generating...'
                    : <><Sparkles className="mr-2" />Generate Image <span className="ml-2 text-xs text-blue-300">-{IMAGE_COST} credits</span></>
                }
              </Button>
              <Button
                variant="outline"
                className="w-full mt-2"
                disabled={!walletConnected || isRefining || credits < PROMPT_COST || !customPrompt.trim()}
                onClick={() => {
                  if (!walletConnected) return;
                  if (credits < PROMPT_COST) {
                    setShowModal(true);
                    return;
                  }
                  spendCredits(PROMPT_COST);
                  handleRefinePrompt();
                }}
              >
                {!walletConnected
                  ? 'Connect wallet to refine prompt'
                  : isRefining
                    ? <><Loader2 className="mr-2 animate-spin"/>Refining...</>
                    : <><Wand2 className="mr-2"/>Refine with AI <span className="ml-2 text-xs text-blue-300">-{PROMPT_COST} credits</span></>
                }
              </Button>
              <CreditsModal open={showModal} onClose={() => setShowModal(false)} onRecharge={handleRecharge} />
            </>;
          })()}

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
