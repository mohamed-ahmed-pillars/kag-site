'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, error, className, id, ...rest }, ref) {
    const generatedId = React.useId();
    const fieldId = id ?? `tf-${generatedId}`;
    const errorId = error ? `${fieldId}-error` : undefined;
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={fieldId} className="text-xs uppercase tracking-wider text-primary/70">
          {label}
        </label>
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            'rounded-xl border border-primary/10 bg-white/60 px-4 py-3 text-sm text-primary outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/30',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-200',
            className,
          )}
          {...rest}
        />
        {error && (
          <span id={errorId} role="alert" className="text-xs text-red-500">
            {error}
          </span>
        )}
      </div>
    );
  },
);
TextField.displayName = 'TextField';
