'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useModal } from '@/hooks/useModal';

interface ModalContextType {
  videoModal: {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    getModalProps: () => {
      ref: React.RefCallback<HTMLDialogElement>;
      className: string;
    };
    getContentProps: () => {
      ref: React.RefCallback<HTMLDivElement>;
      className: string;
    };
  };
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const videoModal = useModal({
    closeOnEscape: true,
    closeOnOverlayClick: true,
  });

  const value: ModalContextType = {
    videoModal,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

export default ModalProvider;
