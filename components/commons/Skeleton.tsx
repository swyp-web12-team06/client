import * as React from 'react';
import { cn } from '@/utils/styles';

interface props extends React.HTMLAttributes<HTMLDivElement> {}

export default function Skeleton({ className }: props) {
  return <div className={cn('h-full w-full animate-pulse rounded-md bg-gray-300', className)} />;
}
