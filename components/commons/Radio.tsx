import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/styles';

const radioRoot = cva('inline-flex items-center gap-2 select-none', {
  variants: {
    disabled: {
      true: 'cursor-not-allowed opacity-60',
      false: 'cursor-pointer',
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

const radioOuter = cva(
  [
    'relative inline-flex items-center justify-center',
    'rounded-full border border-2 bg-gray-100 transition',
    'border-gray-450',
    'peer-focus-visible:ring-primary-200 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const radioDot = cva(
  [
    'pointer-events-none absolute rounded-full transition',
    'scale-75 opacity-0',
    'peer-checked:scale-100 peer-checked:opacity-100',
    'bg-primary-200',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-2 w-2',
        md: 'h-2.5 w-2.5',
        lg: 'h-3 w-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> &
  VariantProps<typeof radioOuter> & {
    label?: React.ReactNode;
  };

export function Radio({ className, label, disabled, size, ...props }: RadioProps) {
  return (
    <label className={cn(radioRoot({ disabled }), className)}>
      <span className="relative inline-flex items-center justify-center">
        <input type="radio" disabled={disabled} className="peer sr-only" {...props} />
        <span
          className={cn(radioOuter({ size }), !disabled && 'hover:border-gray-600')}
          aria-hidden="true"
        />
        <span className={cn(radioDot({ size }))} aria-hidden="true" />
      </span>

      {label ? <span className="text-sm text-gray-900">{label}</span> : null}
    </label>
  );
}
