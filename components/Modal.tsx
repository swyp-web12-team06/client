import { cn } from '@/utils/styles';
import Image from 'next/image';
import React from 'react';

interface props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal = ({ isOpen, onClose, size = 'sm', children }: props) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40"
      onClick={onClose}
    >
      <div
        className={cn(
          'rounded-[10px] bg-gray-50 px-7 py-6',
          size === 'sm' ? 'w-100' : size === 'md' ? 'w-137.5' : 'w-150',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2.5 flex h-6 w-full justify-end">
          <button
            className="flex aspect-square w-6 cursor-pointer items-center justify-center"
            onClick={onClose}
          >
            <Image
              className="h-3 w-3"
              src="/icon/close-x.svg"
              alt="Close modal button"
              width={12}
              height={12}
            />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
