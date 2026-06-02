'use client';

import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type StepIndicatorProps = {
  steps: string[];      // step labels
  current: number;      // 0-indexed
};

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <ol
      aria-label="Progress"
      className="flex w-full items-center justify-between gap-2 sm:gap-4"
    >
      {steps.map((label, i) => {
        const isActive = i === current;
        const isDone = i < current;
        return (
          <li
            key={label}
            aria-current={isActive ? 'step' : undefined}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div className="flex w-full items-center">
              {i > 0 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 transition-colors',
                    isDone || isActive ? 'bg-primary' : 'bg-primary/15',
                  )}
                />
              )}
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm transition-colors',
                  isDone && 'bg-primary text-white',
                  isActive && 'bg-secondary text-primary font-display font-bold shadow-md',
                  !isDone && !isActive && 'bg-white/60 text-primary border border-primary/20',
                )}
              >
                {isDone ? (
                  <>
                    <CheckCircle aria-hidden="true" className="h-4 w-4" />
                    <span className="sr-only">completed</span>
                  </>
                ) : (
                  i + 1
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 transition-colors',
                    isDone ? 'bg-primary' : 'bg-primary/15',
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                'text-center text-[11px] uppercase tracking-wider sm:text-xs',
                isActive ? 'text-primary font-semibold' : 'text-primary/60',
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
