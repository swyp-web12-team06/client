import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/styles';

export type ButtonVariants = VariantProps<typeof buttonVariants>;

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full transition-colors',
  {
    variants: {
      variant: {
        solid: 'bg-primary-200 text-background',
        gradientSolid:
          'text-background from-primary-100 to-primary-200 bg-gradient-to-r from-[-90%] to-[90%]',
        graySolid: 'bg-gray-300 text-gray-800',
        outline: 'text-primary-200 border border-gray-400 bg-gray-50',
        lightOutline: 'border border-gray-400 bg-gray-50 text-gray-800',
      },
      size: {
        sm: 'typo-body2-bold px-4 py-2',
        md: 'typo-body1-bold px-5 py-2.5',
        lg: 'typo-heading3-bold px-6 py-3',
        xl: 'typo-heading2-bold px-8 py-4',
      },
      disabled: {
        true: 'cursor-not-allowed bg-gray-400 text-gray-500',
        false: 'cursor-pointer',
      },
    },
    compoundVariants: [
      {
        variant: 'solid',
        disabled: false,
        class: 'hover:bg-primary-300',
      },
      {
        variant: 'gradientSolid',
        disabled: false,
        class: 'hover:from-primary-200 hover:to-primary-300',
      },
      {
        variant: 'graySolid',
        disabled: false,
        class: 'hover:bg-gray-450',
      },
      {
        variant: 'outline',
        disabled: false,
        class: 'hover:bg-gray-300',
      },

      {
        variant: 'lightOutline',
        disabled: false,
        class: 'hover:bg-gray-300',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      size: 'md',
      disabled: false,
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  disabled?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, disabled }), className)}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
