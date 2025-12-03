'use client';

import { gsap } from 'gsap';
import { useCallback, useEffect, useRef, useState } from 'react';

interface AnimationConfig {
  opacity: number;
  y: number;
  duration: number;
  ease: string;
}

interface UseModalConfig {
  openAnimation?: AnimationConfig;
  closeAnimation?: AnimationConfig;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
}

interface UseModalReturn {
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
}

const defaultConfig: UseModalConfig = {
  openAnimation: {
    opacity: 1,
    y: 0,
    duration: 0.3,
    ease: 'power2.out',
  },
  closeAnimation: {
    opacity: 0,
    y: -50,
    duration: 0.2,
    ease: 'power2.in',
  },
  closeOnEscape: true,
  closeOnOverlayClick: true,
};

export const useModal = (config: UseModalConfig = {}): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const modalElement = useRef<HTMLDialogElement | null>(null);
  const contentElement = useRef<HTMLDivElement | null>(null);
  const isAnimating = useRef(false);

  const mergedConfig = { ...defaultConfig, ...config };

  // Helper to safely modify body overflow
  const setBodyOverflow = useCallback((value: 'hidden' | 'auto') => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = value;
    }
  }, []);

  // Open modal function - refs accessed in event handler context
  const openModal = useCallback(() => {
    const modal = modalElement.current;
    const content = contentElement.current;
    
    if (isOpen || isAnimating.current || !modal) return;

    isAnimating.current = true;
    setIsOpen(true);
    setBodyOverflow('hidden');

    modal.classList.remove('modal-close');
    modal.classList.add('modal-open');

    if (content && mergedConfig.openAnimation) {
      // Set initial state for opening animation
      gsap.set(content, {
        opacity: 0,
        y: -50,
      });

      gsap.to(content, {
        ...mergedConfig.openAnimation,
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    } else {
      isAnimating.current = false;
    }
  }, [isOpen, setBodyOverflow, mergedConfig.openAnimation]);

  // Close modal function - refs accessed in event handler context
  const closeModal = useCallback(async () => {
    const modal = modalElement.current;
    const content = contentElement.current;
    
    if (!isOpen || isAnimating.current || !modal) return;

    isAnimating.current = true;
    setBodyOverflow('auto');

    try {
      if (content && mergedConfig.closeAnimation) {
        await gsap.to(content, {
          ...mergedConfig.closeAnimation,
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
    } catch (error) {
      console.error('Error closing modal:', error);
      modal.classList.remove('modal-open');
      modal.classList.add('modal-close');
      setIsOpen(false);
      isAnimating.current = false;
    }
  }, [isOpen, setBodyOverflow, mergedConfig.closeAnimation]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && mergedConfig.closeOnEscape) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal, mergedConfig.closeOnEscape]);

  // Cleanup on unmount - use direct DOM manipulation for immediate cleanup
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'auto';
      }
    };
  }, []);

  // Callback refs for binding DOM elements
  const modalRefCallback = useCallback((el: HTMLDialogElement | null) => {
    modalElement.current = el;
  }, []);

  const contentRefCallback = useCallback((el: HTMLDivElement | null) => {
    contentElement.current = el;
  }, []);

  const getModalProps = useCallback(() => ({
    ref: modalRefCallback,
    className: 'modal-overlay modal-close',
  }), [modalRefCallback]);

  const getContentProps = useCallback(() => ({
    ref: contentRefCallback,
    className: 'modal-content',
  }), [contentRefCallback]);

  return {
    isOpen,
    openModal,
    closeModal,
    getModalProps,
    getContentProps,
  };
};
