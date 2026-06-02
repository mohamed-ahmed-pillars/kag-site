'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, error, className, id, ...rest }, ref) {
    const fieldId = id ?? `tf-${React.useId()}`;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId} className="text-xs uppercase tracking-wider text-primary/70">
          {label}
        </label>
        <input
          ref={ref}
          id={fieldId}
          className={cn(
            'rounded-xl border border-primary/10 bg-white/60 px-4 py-3 text-sm text-primary outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/30',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-200',
            className,
          )}
          {...rest}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  },
);
