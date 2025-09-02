
'use client';

import { Dispatch, FC, SetStateAction } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, Download } from 'lucide-react';
import type { AnimeStyle } from '@/app/page';
import { ScrollArea } from './ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AIPanelProps {
  animeStyle: AnimeStyle;
  setAnimeStyle: Dispatch<SetStateAction<AnimeStyle>>;
  isGenerating: boolean;
  onGenerate: () => void;
  generatedImage: string | null;
}

const styleOptions: { value: AnimeStyle; label: string }[] = [
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'classic', label: 'Classic' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'chibi', label: 'Chibi' },
]

export const AIPanel: FC<AIPanelProps> = ({
  animeStyle,
  setAnimeStyle,
  isGenerating,
  onGenerate,
  generatedImage,
}) => {
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'neon-canvas-ai-art.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <aside className="w-full h-full bg-card/50 backdrop-blur-sm flex-col z-10 gap-4 md:flex md:w-96 md:border-l md:border-primary/20 md:p-4">
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4 md:p-0 md:pr-2">
          <h2 className="text-xl font-bold text-glow-accent text-center hidden md:block">AI Generation</h2>

          <div className="space-y-4">
            <Label className="text-glow-accent">
              Anime Style
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

            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              className="w-full neon-glow-accent h-12 text-lg"
            >
              {isGenerating ? 'Generating...' : <><Sparkles className="mr-2" />Generate Image</>}
            </Button>
          </div>

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
