import * as React from 'react';
import { cn } from '@/utils/styles';

type Variant = 'text' | 'image' | 'avatar';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  lines?: number;
  lineHeightClassName?: string;
};

export default function Skeleton({
  variant = 'image',
  lines = 3,
  lineHeightClassName = 'h-4',
  className,
}: Props) {
  const base = 'w-full h-full bg-gray-400 animate-pulse';

  if (variant === 'text') {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              base,
              'rounded-sm',
              lineHeightClassName,
              i === lines - 1 ? 'w-2/3' : 'w-full',
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === 'avatar') {
    return <div className={cn(base, 'rounded-full', className)} />;
  }

  return <div className={cn(base, 'w-full rounded-xl', className)} />;
}
