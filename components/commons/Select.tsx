import { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/styles';
import { Button } from './Button';
import DropDown from '@/public/icon/drop-down.svg';
import DropDown2 from '@/public/icon/drop-down-2.svg';

export interface SelectItem {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectSeparator {
  type: 'separator';
}

interface SelectGroup {
  type: 'group';
  label: string;
  items: (SelectItem | SelectSeparator)[];
}

export type SelectItemType = SelectItem | SelectSeparator | SelectGroup;

interface SelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  items: SelectItemType[];
  onClose?: () => void;
  className?: string;
}

export default function Select({ value, onValueChange, items, onClose, className }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedItem = items
    .flatMap((item) => ('items' in item ? item.items : [item]))
    .find((item) => 'value' in item && item.value === value) as SelectItem | undefined;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onClose?.();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (itemValue: string) => {
    onValueChange(itemValue);
    setIsOpen(false);
  };

  const renderItem = (item: SelectItem | SelectSeparator, index: number) => {
    if ('type' in item && item.type === 'separator') {
      return <div key={`separator-${index}`} className="my-1 h-px bg-gray-200" />;
    }

    if ('value' in item) {
      return (
        <div
          key={item.value}
          onClick={() => !item.disabled && handleSelect(item.value)}
          className={cn(
            'hover:bg-primary-50 h-9 cursor-pointer px-3 py-2 text-left leading-5 text-gray-800',
            { 'text-primary-200 hover:text-primary-400': value === item.value },
            { 'cursor-not-allowed opacity-50': item.disabled },
          )}
        >
          {item.label}
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={selectRef} className="relative w-full">
      {/* 트리거 버튼 */}
      <Button
        className={cn(
          className,
          'typo-body1-medium focus:border-primary-200 h-11 w-44 justify-between overflow-hidden bg-gray-200 px-3 text-gray-800 hover:bg-gray-50',
        )}
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        suffixIcon={
          !className ? (
            <DropDown
              className={`h-6 w-6 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180 transform' : ''}`}
            />
          ) : (
            <DropDown2 className="h-6 w-6" />
          )
        }
      >
        <span className={cn(className && 'hidden', 'truncate', { 'text-gray-800': !selectedItem })}>
          {selectedItem?.label}
        </span>
      </Button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div
          className={cn(
            className && 'right-0 min-w-44',
            'focus:border-primary-200 absolute z-10 mt-1.75 w-full overflow-hidden rounded-lg border border-gray-300 bg-gray-100 shadow-[0_0_24px_0_#00000033]',
          )}
        >
          {items.map((item, index) => {
            if ('type' in item && item.type === 'group') {
              return (
                <div key={`group-${index}`}>
                  {item.label && (
                    <div className="typo-body2-regular px-4 pt-2 pb-1 text-gray-500 uppercase">
                      {item.label}
                    </div>
                  )}
                  {item.items.map(renderItem)}
                </div>
              );
            }
            return renderItem(item, index);
          })}
        </div>
      )}
    </div>
  );
}
