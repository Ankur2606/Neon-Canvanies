import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NeonCanvasLogo } from './neon-canvas-logo';
import { Paintbrush, Sparkles, Layers } from 'lucide-react';

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WelcomeDialog = ({ open, onOpenChange }: WelcomeDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-lg bg-card border-primary/50">
      <DialogHeader>
        <NeonCanvasLogo className="justify-center mb-4" />
        <DialogTitle className="text-center text-2xl font-headline text-glow">
          Welcome to the Digital Dystopia
        </DialogTitle>
        <DialogDescription className="text-center text-lg text-primary/80">
          Your cyberpunk drawing experience begins now.
        </DialogDescription>
      </DialogHeader>
      <div className="my-4 space-y-4">
        <div className="flex items-start gap-4">
          <Paintbrush className="h-8 w-8 text-accent mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-foreground">Powerful Drawing Tools</h3>
            <p className="text-muted-foreground">Unleash your creativity with a suite of brushes, colors, and controls fit for a netrunner.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Sparkles className="h-8 w-8 text-accent mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-foreground">AI-Powered Augmentation</h3>
            <p className="text-muted-foreground">Transform your sketches into stunning anime art with the integrated Gemini AI generator.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Layers className="h-8 w-8 text-accent mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-foreground">More Features Coming</h3>
            <p className="text-muted-foreground">Stay tuned for future updates, including an advanced layer system and more export options.</p>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => onOpenChange(false)} className="w-full neon-glow">
          Plug In &amp; Start Drawing
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
