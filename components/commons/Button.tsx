import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/styles';

export type ButtonVariants = VariantProps<typeof buttonVariants>;

const buttonVariants = cva('inline-flex cursor-pointer items-center justify-center rounded-full', {
  variants: {
    variant: {
      primary: 'bg-brand-300 text-background hover:bg-brand-600',
      tertiary:
        'text-background border border-gray-400 bg-gray-200 hover:bg-gray-300 hover:bg-gray-500',
    },
    size: {
      sm: 'typo-body2-bold h-8 px-3',
      md: 'typo-body1-bold h-10 px-4',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);

Button.displayName = 'Button';
