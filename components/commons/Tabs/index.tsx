import * as React from 'react';
import { cn } from '@/utils/styles';
import { Tab } from './Tab';

export type TabItem = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
  content: React.ReactNode;
};

type props = {
  items: TabItem[];
  value: string;
  onValueChange: (v: string) => void;
  className?: string;
};

export function Tabs({ items, value, onValueChange, className }: props) {
  const current = items.find((item) => item.value === value) ?? items[0];

  if (items.length === 0) {
    return <div className={cn('w-full', className)} />;
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="grid grid-cols-5 gap-2" role="tablist">
        {items.map((item) => {
          const selected = item.value === current?.value;

          return (
            <Tab
              key={item.value}
              disabled={item.disabled}
              onClick={() => !item.disabled && onValueChange(item.value)}
              variant={selected ? 'active' : 'default'}
              role="tab"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
            >
              {item.label}
            </Tab>
          );
        })}
      </div>

      <div className="mt-4" role="tabpanel">
        {current?.content}
      </div>
    </div>
  );
}
