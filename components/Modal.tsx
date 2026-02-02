import Image from 'next/image';
import React from 'react';

interface props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: props) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40"
      onClick={onClose}
    >
      <div className="w-137.5 rounded-[10px] bg-gray-50 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-2.5 h-6 w-full text-end">
          <button className="cursor-pointer" onClick={onClose}>
            <Image src="/icon/input-clear.svg" alt="Close modal button" width={24} height={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
