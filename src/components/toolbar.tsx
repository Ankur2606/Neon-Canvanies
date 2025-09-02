
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { NeonCanvasLogo } from './neon-canvas-logo';
import { Separator } from './ui/separator';
import type { Tool } from '@/app/page';
import { ScrollArea } from './ui/scroll-area';

interface ToolbarProps {
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
}

export const Toolbar: FC<ToolbarProps> = ({
  tool, setTool, color, setColor, brushSize, setBrushSize,
  opacity, setOpacity, onClear, onUndo, onRedo, onExport, onImport
}) => {
  const handleFileImport = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImport(e.target.files[0]);
      e.target.value = ''; // Reset file input
    }
  };

  return (
    <aside className="w-full h-full bg-card/50 backdrop-blur-sm flex flex-col p-4 z-10">
      <div className="flex-shrink-0">
        <NeonCanvasLogo className="hidden md:flex mb-4" />
        <Separator className="mb-4 bg-primary/20 hidden md:block" />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6 pr-2">
            <div>
              <Label className="text-glow-accent px-1">Tools</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button variant={tool === 'brush' ? 'secondary' : 'outline'} onClick={() => setTool('brush')} className="h-12"><Paintbrush className="mr-2" /> Brush</Button>
                <Button variant={tool === 'eraser' ? 'secondary' : 'outline'} onClick={() => setTool('eraser')} className="h-12"><Eraser className="mr-2" /> Eraser</Button>
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="brush-size" className="text-glow-accent px-1">Size: {brushSize}px</Label>
              <Slider id="brush-size" value={[brushSize]} onValueChange={(v) => setBrushSize(v[0])} min={1} max={50} step={1} />
            </div>

            <div className="space-y-4">
              <Label htmlFor="opacity" className="text-glow-accent px-1">Opacity: {Math.round(opacity * 100)}%</Label>
              <Slider id="opacity" value={[opacity]} onValueChange={(v) => setOpacity(v[0])} min={0.1} max={1} step={0.1} />
            </div>

            <Separator className="my-4 bg-primary/20" />

            <div>
                <Label className="text-glow-accent px-1">Color</Label>
                <div className="mt-2 flex items-center gap-2">
                    <input id="custom-color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-12 bg-transparent border-none rounded-md p-0 cursor-pointer" />
                    <div className="flex-1">
                        <div className="px-2 py-1 rounded-md bg-input w-full text-center font-mono text-sm h-12 flex items-center justify-center">
                            {color.toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>


            <Separator className="my-4 bg-primary/20" />

            <div>
              <Label className="text-glow-accent px-1">Actions</Label>
              <div className="mt-2 space-y-2">
                 <div className="grid grid-cols-2 gap-2">
                   <Button variant="outline" onClick={onUndo}><Undo className="mr-2"/>Undo</Button>
                   <Button variant="outline" onClick={onRedo}><Redo className="mr-2"/>Redo</Button>
                 </div>
                 <Button variant="destructive" onClick={onClear} className="w-full"><Trash2 className="mr-2"/>Clear Canvas</Button>
                 <Button onClick={onExport} className="w-full"><Download className="mr-2"/>Export PNG</Button>
                 <Button asChild variant="outline" className="w-full">
                  <label htmlFor="import-file" className="cursor-pointer flex items-center justify-center w-full h-full">
                    <Upload className="mr-2" /> Import Image
                  </label>
                 </Button>
                 <input id="import-file" type="file" accept="image/*" className="sr-only" onChange={handleFileImport} />
              </div>
            </div>
        </div>
      </ScrollArea>
    </aside>
  );
};
