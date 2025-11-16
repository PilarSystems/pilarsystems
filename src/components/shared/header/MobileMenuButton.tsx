'use client';

import { useMobileMenuContext } from '@/context/MobileMenuContext';
import { cn } from '@/utils/cn';

const MobileMenuButton = () => {
  const { openMenu } = useMobileMenuContext();

  return (
    <div className="block xl:hidden">
      <button
        onClick={openMenu}
        aria-label="Menü öffnen"
        className={cn(
          `
          flex size-12 flex-col items-center justify-center 
          gap-[5px] rounded-full transition-all duration-200 
          hover:scale-105 group

          /* Hintergrund (klarer, moderner, Pilar-Branding) */
          bg-primary-500/10 dark:bg-primary-500/20 
          backdrop-blur-md
          hover:bg-primary-500/20 dark:hover:bg-primary-500/30
        `
        )}
      >
        <span className="sr-only">Menu</span>

        {/* Burger-Lines – minimal & modern */}
        <span
          className="
            block h-0.5 w-6 rounded-full 
            bg-primary-500 dark:bg-primary-300 
            transition-colors duration-200 
            group-hover:bg-primary-600 dark:group-hover:bg-primary-200
          "
        ></span>
        <span
          className="
            block h-0.5 w-6 rounded-full 
            bg-primary-500 dark:bg-primary-300 
            transition-colors duration-200 
            group-hover:bg-primary-600 dark:group-hover:bg-primary-200
          "
        ></span>
        <span
          className="
            block h-0.5 w-6 rounded-full 
            bg-primary-500 dark:bg-primary-300 
            transition-colors duration-200 
            group-hover:bg-primary-600 dark:group-hover:bg-primary-200
          "
        ></span>
      </button>
    </div>
  );
};

export default MobileMenuButton;
