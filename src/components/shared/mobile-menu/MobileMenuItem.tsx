'use client';

import { useMobileMenuContext } from '@/context/MobileMenuContext';
import { cn } from '@/utils/cn';
import { ReactNode } from 'react';

interface MobileMenuItemProps {
  id: string;
  title: string;
  children?: ReactNode;
  hasSubmenu?: boolean;
}

const MobileMenuItem = ({ id, title, children, hasSubmenu = false }: MobileMenuItemProps) => {
  const { activeSubmenu, toggleSubmenu } = useMobileMenuContext();
  const isActive = activeSubmenu === id;

  const handleToggle = () => {
    if (hasSubmenu) {
      toggleSubmenu(id);
    }
  };

  // 🔹 Fall 1: Kein Submenu → wir rendern einfach die Children (z. B. <ul><li><Link ... />)
  if (!hasSubmenu) {
    return (
      <li className="relative space-y-0">
        {children ?? (
          <button
            className={cn(
              'text-tagline-1 border-stroke-4 dark:border-stroke-6 flex w-full items-center justify-between border-b py-3 text-left font-normal transition-all duration-200',
              'text-secondary/60 dark:text-accent/60 hover:text-primary-500 dark:hover:text-primary-300',
            )}
          >
            <span>{title}</span>
          </button>
        )}
      </li>
    );
  }

  // 🔹 Fall 2: Mit Submenu → alte Logik bleibt erhalten
  return (
    <li className="relative space-y-0">
      <button
        onClick={handleToggle}
        className={cn(
          'sub-menu text-tagline-1 border-stroke-4 dark:border-stroke-6 flex w-full cursor-pointer items-center justify-between border-b py-3 text-left font-normal transition-all duration-200',
          isActive
            ? 'text-primary-500 dark:text-primary-300 font-medium'
            : 'text-secondary/60 dark:text-accent/60 hover:text-primary-500 dark:hover:text-primary-300',
        )}
        aria-expanded={hasSubmenu ? isActive : undefined}
        aria-controls={hasSubmenu ? `submenu-${id}` : undefined}
      >
        <span>{title}</span>
        <span className={cn('transition-transform duration-300 ease-in-out', isActive && 'rotate-90')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 12L12 8L8 4"
              className="stroke-primary-500 dark:stroke-primary-300"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {children && (
        <div
          id={`submenu-${id}`}
          className={cn(
            'dark:bg-background-7 ml-3.5 w-full overflow-y-auto bg-white transition-all duration-300',
            isActive ? 'block' : 'hidden',
          )}
        >
          {children}
        </div>
      )}
    </li>
  );
};

MobileMenuItem.displayName = 'MobileMenuItem';

export default MobileMenuItem;
