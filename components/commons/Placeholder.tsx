import * as React from 'react';
import { cn } from '@/utils/styles';
import ImageIcon from '@/public/icon/image.svg';
import UserIcon from '@/public/icon/user.svg';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'image' | 'avatar';
}

export default function Placeholder({ variant = 'image', className }: Props) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center bg-gray-200',
        variant === 'avatar' ? 'rounded-full' : 'rounded-2xl',
        className,
      )}
    >
      {variant === 'avatar' ? (
        <UserIcon className="h-10 w-10 text-gray-500" />
      ) : (
        <ImageIcon className="hidden h-auto w-1/2 max-w-16 text-gray-500 sm:block" />
      )}

      <div className="h-2 w-2 rounded-full bg-gray-400 sm:hidden" />
    </div>
  );
}
