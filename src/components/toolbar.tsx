'use client';

import type { Dispatch, FC, SetStateAction, ChangeEvent } from 'react';
import {
  Paintbrush,
  Eraser,
  Undo,
  Redo,
  Trash2,
  Download,
  Upload,
  Palette,
  Sparkles,
  Layers,
  File,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NeonCanvasLogo } from './neon-canvas-logo';
import { Separator } from './ui/separator';
import type { Tool, AnimeStyle } from '@/app/page';

const cyberpunkColors = [
  '#FF32F0', '#BE42FF', '#00FFFF', '#FFD700',
  '#7FFF00', '#FF4500', '#FFFFFF', '#949494',
];

interface ToolbarProps {
  tool: Tool;
  setTool: Dispatch<SetStateAction<Tool>>;
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  brushSize: number;
  setBrushSize: Dispatch<SetStateAction<number>>;
  opacity: number;
  setOpacity: Dispatch<SetStateAction<number>>;
  animeStyle: AnimeStyle;
  setAnimeStyle: Dispatch<SetStateAction<AnimeStyle>>;
  isGenerating: boolean;
  onGenerate: () => void;
  onClear: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export const Toolbar: FC<ToolbarProps> = ({
  tool, setTool, color, setColor, brushSize, setBrushSize,
  opacity, setOpacity, animeStyle, setAnimeStyle,
  isGenerating, onGenerate, onClear, onUndo, onRedo, onExport, onImport
}) => {
  const handleFileImport = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImport(e.target.files[0]);
    }
  };

  return (
    <aside className="w-full md:w-80 h-auto md:h-screen bg-card/50 backdrop-blur-sm border-r border-primary/20 flex flex-col p-4 z-10">
      <NeonCanvasLogo className="hidden md:flex mb-4" />
      <Separator className="mb-4 bg-primary/20 hidden md:block" />
      <Tabs defaultValue="tools" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-5 bg-background/50">
          <TabsTrigger value="tools" className="neon-glow-accent data-[state=active]:bg-primary/20"><Paintbrush /></TabsTrigger>
          <TabsTrigger value="color" className="neon-glow-accent data-[state=active]:bg-primary/20"><Palette /></TabsTrigger>
          <TabsTrigger value="ai" className="neon-glow-accent data-[state=active]:bg-primary/20"><Sparkles /></TabsTrigger>
          <TabsTrigger value="layers" className="neon-glow-accent data-[state=active]:bg-primary/20"><Layers /></TabsTrigger>
          <TabsTrigger value="file" className="neon-glow-accent data-[state=active]:bg-primary/20"><File /></TabsTrigger>
        </TabsList>

        <div className="flex-1 mt-4 space-y-6">
          <TabsContent value="tools">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-2">
                <Button variant={tool === 'brush' ? 'secondary' : 'outline'} onClick={() => setTool('brush')} className="h-12"><Paintbrush className="mr-2" /> Brush</Button>
                <Button variant={tool === 'eraser' ? 'secondary' : 'outline'} onClick={() => setTool('eraser')} className="h-12"><Eraser className="mr-2" /> Eraser</Button>
              </div>
              <div className="space-y-4">
                <Label htmlFor="brush-size" className="text-glow-accent">Size: {brushSize}px</Label>
                <Slider id="brush-size" value={[brushSize]} onValueChange={(v) => setBrushSize(v[0])} min={1} max={50} step={1} />
              </div>
              <div className="space-y-4">
                <Label htmlFor="opacity" className="text-glow-accent">Opacity: {Math.round(opacity * 100)}%</Label>
                <Slider id="opacity" value={[opacity]} onValueChange={(v) => setOpacity(v[0])} min={0.1} max={1} step={0.1} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="color">
            <div className="space-y-4">
              <Label className="text-glow-accent">Color Palette</Label>
              <div className="grid grid-cols-4 gap-2">
                {cyberpunkColors.map((c) => (
                  <button key={c} onClick={() => setColor(c)} style={{ backgroundColor: c }} className={`w-full h-12 rounded-md transition-all ${color === c ? 'ring-2 ring-offset-2 ring-offset-background ring-accent' : ''}`} />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="custom-color" className="text-sm">Custom:</Label>
                <input id="custom-color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 bg-transparent border-none rounded-md" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="ai">
            <div className="space-y-4">
              <Label htmlFor="ai-style" className="text-glow-accent">Anime Style</Label>
              <Select value={animeStyle} onValueChange={(v: AnimeStyle) => setAnimeStyle(v)}>
                <SelectTrigger id="ai-style">
                  <SelectValue placeholder="Select Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="chibi">Chibi</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={onGenerate} disabled={isGenerating} className="w-full neon-glow-accent h-12">
                {isGenerating ? 'Generating...' : <><Sparkles className="mr-2" />Generate Image</>}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="layers">
            <div className="text-muted-foreground text-center space-y-4 p-8 border border-dashed rounded-md">
              <Layers className="mx-auto h-10 w-10" />
              <p>Layer functionality is coming soon in a future update.</p>
            </div>
          </TabsContent>
          <TabsContent value="file">
            <div className="space-y-2">
               <div className="grid grid-cols-2 gap-2">
                 <Button variant="outline" onClick={onUndo}><Undo className="mr-2"/>Undo</Button>
                 <Button variant="outline" onClick={onRedo}><Redo className="mr-2"/>Redo</Button>
               </div>
               <Button variant="destructive" onClick={onClear} className="w-full"><Trash2 className="mr-2"/>Clear Canvas</Button>
               <Button onClick={onExport} className="w-full"><Download className="mr-2"/>Export PNG</Button>
               <Button asChild variant="outline" className="w-full">
                <label htmlFor="import-file" className="cursor-pointer flex items-center justify-center">
                  <Upload className="mr-2" /> Import Image
                  <input id="import-file" type="file" accept="image/*" className="sr-only" onChange={handleFileImport} />
                </label>
               </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
};
