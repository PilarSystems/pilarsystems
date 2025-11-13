'use client';

import { useMobileMenuContext } from '@/context/MobileMenuContext';

const MobileMenuButton = () => {
  const { openMenu } = useMobileMenuContext();

  return (
    <div className="block xl:hidden">
      <button
        onClick={openMenu}
        aria-label="Open mobile menu"
        className="
          nav-hamburger 
          flex size-12 cursor-pointer flex-col items-center justify-center 
          gap-[5px] rounded-full 
          transition-all duration-200 hover:scale-105 group

          /* Hintergrund (statt grau → Pilar Blau hell) */
          bg-primary-100 dark:bg-primary-800
          hover:bg-primary-200 dark:hover:bg-primary-700
        "
      >
        <span className="sr-only">Menu</span>

        {/* Hamburger Lines (statt schwarz → Pilar Blau) */}
        <span
          className="
            block h-0.5 w-6 
            bg-primary-600 
            dark:bg-primary-300 
            transition-all duration-200 
            group-hover:bg-primary-700 
            dark:group-hover:bg-primary-200
          "
        ></span>
        <span
          className="
            block h-0.5 w-6 
            bg-primary-600 
            dark:bg-primary-300 
            transition-all duration-200 
            group-hover:bg-primary-700 
            dark:group-hover:bg-primary-200
          "
        ></span>
        <span
          className="
            block h-0.5 w-6 
            bg-primary-600 
            dark:bg-primary-300 
            transition-all duration-200 
            group-hover:bg-primary-700 
            dark:group-hover:bg-primary-200
          "
        ></span>
      </button>
    </div>
  );
};

export default MobileMenuButton;
