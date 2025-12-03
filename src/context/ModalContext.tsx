'use client';

import React, { createContext, useContext, ReactNode, useRef, useState, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';

interface ModalContextType {
  videoModal: {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
  };
  modalRef: React.RefObject<HTMLDialogElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isAnimating = useRef(false);

  const openModal = useCallback(() => {
    const modal = modalRef.current;
    const content = contentRef.current;
    
    if (isOpen || isAnimating.current || !modal) return;

    isAnimating.current = true;
    setIsOpen(true);
    document.body.style.overflow = 'hidden';

    modal.classList.remove('modal-close');
    modal.classList.add('modal-open');

    if (content) {
      gsap.set(content, { opacity: 0, y: -50 });
      gsap.to(content, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    } else {
      isAnimating.current = false;
    }
  }, [isOpen]);

  const closeModal = useCallback(async () => {
    const modal = modalRef.current;
    const content = contentRef.current;
    
    if (!isOpen || isAnimating.current || !modal) return;

    isAnimating.current = true;
    document.body.style.overflow = 'auto';

    if (content) {
      await gsap.to(content, {
        opacity: 0,
        y: -50,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          modal.classList.remove('modal-open');
          modal.classList.add('modal-close');
          setIsOpen(false);
          isAnimating.current = false;
        },
      });
    } else {
      modal.classList.remove('modal-open');
      modal.classList.add('modal-close');
      setIsOpen(false);
      isAnimating.current = false;
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  // Cleanup
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const value: ModalContextType = {
    videoModal: {
      isOpen,
      openModal,
      closeModal,
    },
    modalRef,
    contentRef,
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
