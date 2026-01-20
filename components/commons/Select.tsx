import { useState, useEffect, useRef } from 'react';
import { cn } from '@/utils/styles';
import { Button } from './Button';
import DropDown from '@/public/icon/drop-down.svg';

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
}

export default function Select({
  value,
  onValueChange,
  items,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedItem = items
    .flatMap(item => ('items' in item ? item.items : [item]))
    .find(item => 'value' in item && item.value === value) as SelectItem | undefined;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (itemValue: string) => {
    onValueChange(itemValue);
    setIsOpen(false);
  };

  const renderItem = (item: SelectItem | SelectSeparator, index: number) => {
    if ('type' in item && item.type === 'separator') {
      return <div key={`separator-${index}`} className="h-px bg-gray-200 my-1" />;
    }

    if ('value' in item) {
      return (
        <div
          key={item.value}
          onClick={() => !item.disabled && handleSelect(item.value)}
          className={cn(
            "h-9 px-3 py-2 leading-5 text-left text-gray-800 cursor-pointer hover:bg-primary-50",
            { "text-primary-200 hover:text-primary-400": value === item.value },
            { "opacity-50 cursor-not-allowed": item.disabled }
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
        className='w-44 h-11 px-3 justify-between text-gray-800 font-medium hover:bg-gray-50'
        variant="outline" onClick={() => setIsOpen(!isOpen)}
        suffixIcon={<DropDown className={`w-6 h-6 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />}>
        <span className={cn("truncate", { "text-gray-800": !selectedItem })}>{selectedItem?.label}</span>
      </Button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1.75 bg-gray-50 border border-gray-300 focus:border-primary-200 rounded-lg shadow-[0_0_24px_0_#00000033]">
          {items.map((item, index) => {
            if ('type' in item && item.type === 'group') {
              return (
                <div key={`group-${index}`}>
                  {item.label && <div className="px-4 pt-2 pb-1 text-xs font-bold text-gray-500 uppercase">{item.label}</div>}
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
