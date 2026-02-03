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
        <div className="mb-2.5 h-6 w-full flex justify-end">
          <button className="cursor-pointer w-6 aspect-square flex justify-center items-center" onClick={onClose}>
            <Image className='w-3 h-3' src="/icon/input-clear.svg" alt="Close modal button" width={12} height={12} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
