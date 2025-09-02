import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface ResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string | null;
}

export const ResultDialog = ({ open, onOpenChange, imageUrl }: ResultDialogProps) => {
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'neon-canvanies-ai-art.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-card border-primary/50">
        <DialogHeader>
          <DialogTitle className="text-glow text-2xl">Generation Complete</DialogTitle>
          <DialogDescription>Your cyberpunk masterpiece is ready.</DialogDescription>
        </DialogHeader>
        <div className="my-4 aspect-square relative flex items-center justify-center rounded-md overflow-hidden border border-primary/20 bg-black/20">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Generated AI anime"
              fill
              className="object-contain"
            />
          ) : (
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={handleDownload} disabled={!imageUrl} className="neon-glow-accent">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
