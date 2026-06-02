'use client';

import { cn } from '@/lib/utils';

type ChipProps = {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

export function Chip({ selected, onClick, children, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'rounded-xl border px-4 py-2 text-sm transition-all hover:-translate-y-0.5',
        selected
          ? 'border-secondary bg-secondary/20 text-primary'
          : 'border-primary/10 bg-white/60 text-primary/70 hover:border-primary/30',
        className,
      )}
    >
      {children}
    </button>
  );
}
