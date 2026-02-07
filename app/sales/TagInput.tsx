'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/styles';
import Image from 'next/image';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export default function TagInput({
  id,
  tags,
  onTagsChange,
  placeholder,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addTag = (tagValue: string) => {
    const trimmedValue = tagValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onTagsChange([...tags, trimmedValue]);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div
      className={cn(
        'flex h-10 flex-wrap items-center gap-2 rounded-lg border bg-gray-100',
        'focus-within:border-primary-200 border-gray-500 hover:border-gray-800',
        tags.length > 0 ? 'p-1' : 'px-4.75',
        className,
      )}
    >
      {tags.map((tag) => (
        <div
          key={tag}
          className="flex items-center gap-1 rounded-2xl bg-gray-300 px-3 py-1 text-sm font-medium text-gray-500"
        >
          <span>{tag}</span>
          <button type="button" onClick={() => removeTag(tag)} className="ml-2 cursor-pointer">
            <Image src="/icon/tag-clear.svg" alt="Remove tag" width={13} height={13} />
          </button>
        </div>
      ))}
      <input
        id={id}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length < 5 ? placeholder : '최대 5개까지 입력 가능합니다.'}
        className="flex min-w-57.5 bg-transparent text-gray-800 outline-none placeholder:text-gray-500"
        disabled={tags.length >= 5}
      />
    </div>
  );
}
