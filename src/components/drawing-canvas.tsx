'use client';

import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import type { Tool } from '@/app/page';

interface DrawingCanvasProps {
  tool: Tool;
  color: string;
  brushSize: number;
  opacity: number;
}

export interface DrawingCanvasRef {
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  exportAsPNG: () => string;
  importImage: (image: HTMLImageElement) => void;
  isCanvasEmpty: () => boolean;
}

export const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
  ({ tool, color, brushSize, opacity }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const isDrawingRef = useRef(false);
    const historyRef = useRef<ImageData[]>([]);
    const historyIndexRef = useRef(-1);
    const [isEmpty, setIsEmpty] = useState(true);

    const initializeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const parent = canvas.parentElement;
      if (!parent) return;

      const dpi = window.devicePixelRatio || 1;
      canvas.width = parent.offsetWidth * dpi;
      canvas.height = parent.offsetHeight * dpi;
      canvas.style.width = `${parent.offsetWidth}px`;
      canvas.style.height = `${parent.offsetHeight}px`;

      const context = canvas.getContext('2d');
      if (!context) return;
      context.scale(dpi, dpi);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      contextRef.current = context;
      saveState();
    };
    
    useEffect(() => {
      initializeCanvas();
      window.addEventListener('resize', initializeCanvas);
      return () => window.removeEventListener('resize', initializeCanvas);
    }, []);

    const saveState = () => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (!canvas || !context) return;

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      historyRef.current.splice(historyIndexRef.current + 1);
      historyRef.current.push(imageData);
      historyIndexRef.current = historyRef.current.length - 1;
    };
    
    const restoreState = () => {
      const canvas = canvasRef.current;
      const context = contextRef.current;
      if (!canvas || !context || historyIndexRef.current < 0) return;

      const imageData = historyRef.current[historyIndexRef.current];
      context.putImageData(imageData, 0, 0);
    };

    const getCoords = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      
      let clientX, clientY;
      if (e instanceof MouseEvent) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else if (e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        return null;
      }
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    }

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      const context = contextRef.current;
      const coords = getCoords(e);
      if (!context || !coords) return;
      
      isDrawingRef.current = true;
      context.beginPath();
      context.moveTo(coords.x, coords.y);
      e.preventDefault();
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;
      const context = contextRef.current;
      const coords = getCoords(e);
      if (!context || !coords) return;

      context.lineWidth = brushSize;
      context.globalAlpha = opacity;
      
      if (tool === 'eraser') {
        context.globalCompositeOperation = 'destination-out';
      } else {
        context.globalCompositeOperation = 'source-over';
        context.strokeStyle = color;
      }

      context.lineTo(coords.x, coords.y);
      context.stroke();
      e.preventDefault();
    };

    const stopDrawing = () => {
      const context = contextRef.current;
      if (!context) return;
      
      if (isDrawingRef.current) {
        context.closePath();
        saveState();
        if(isEmpty) setIsEmpty(false);
      }
      isDrawingRef.current = false;
    };

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseleave', stopDrawing);
      
      canvas.addEventListener('touchstart', startDrawing);
      canvas.addEventListener('touchmove', draw);
      canvas.addEventListener('touchend', stopDrawing);

      return () => {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', draw);
        canvas.removeEventListener('mouseup', stopDrawing);
        canvas.removeEventListener('mouseleave', stopDrawing);

        canvas.removeEventListener('touchstart', startDrawing);
        canvas.removeEventListener('touchmove', draw);
        canvas.removeEventListener('touchend', stopDrawing);
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tool, color, brushSize, opacity]);

    useImperativeHandle(ref, () => ({
      clearCanvas: () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (!canvas || !context) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        saveState();
        setIsEmpty(true);
      },
      undo: () => {
        if (historyIndexRef.current > 0) {
          historyIndexRef.current -= 1;
          restoreState();
        }
      },
      redo: () => {
        if (historyIndexRef.current < historyRef.current.length - 1) {
          historyIndexRef.current += 1;
          restoreState();
        }
      },
      exportAsPNG: () => canvasRef.current?.toDataURL('image/png') || '',
      importImage: (image) => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (!canvas || !context) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
        saveState();
        setIsEmpty(false);
      },
      isCanvasEmpty: () => isEmpty,
    }));

    return (
      <canvas ref={canvasRef} className="absolute top-0 left-0 h-full w-full touch-none" />
    );
  }
);

DrawingCanvas.displayName = 'DrawingCanvas';
