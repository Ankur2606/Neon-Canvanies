import type { FC } from 'react';

export const NeonCanvasLogo: FC<{ className?: string }> = ({ className }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="neon-glow-accent"
    >
      <path
        d="M12 38V10L36 38V10"
        stroke="hsl(var(--accent))"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <h1 className="ml-3 text-2xl font-headline font-bold text-glow-accent">
      Neon Canvanies
    </h1>
  </div>
);
