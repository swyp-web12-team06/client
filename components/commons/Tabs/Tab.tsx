import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/styles';

export type TabVariants = VariantProps<typeof tabVariants>;
const tabVariants = cva(
  'typo-body2-semibold inline-flex w-full min-w-0 items-center justify-center gap-2 rounded-full border px-4 py-2 transition-colors',
  {
    variants: {
      variant: {
        default: 'border-gray-500 bg-gray-300 text-gray-800',
        active: 'border-gray-400 bg-gray-50 text-gray-800',
      },
      disabled: {
        true: 'cursor-not-allowed bg-gray-400 text-gray-500',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);
export interface TabProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>, TabVariants {
  disabled?: boolean;
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ className, type = 'button', variant, disabled = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        className={cn(tabVariants({ variant, disabled }), className)}
        {...props}
      >
        <span className="truncate">{children}</span>
      </button>
    );
  },
);

Tab.displayName = 'Tab';
