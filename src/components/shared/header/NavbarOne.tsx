'use client';

import { MobileMenuProvider } from '@/context/MobileMenuContext';
import { useNavbarScroll } from '@/hooks/useScrollHeader';
import { cn } from '@/utils/cn';
import { FC } from 'react';

import Logo from './Logo';
import MobileMenu from '../MobileMenu';
import MobileMenuButton from './MobileMenuButton';
import NavCTAButton from './NavCTAButton';
import NavItemLink from './NavItemLink';

import { navigationItems, headerConfig } from '@/data/header';

interface NavbarOneProps {
  className?: string;
  megaMenuColor?: string; // aktuell nicht genutzt, bleibt für Kompatibilität
  btnClassName?: string;
  navItemClass?: string;
}

const NavbarOne: FC<NavbarOneProps> = ({ className, btnClassName, navItemClass }) => {
  const { isScrolled } = useNavbarScroll(100);
  const { cta } = headerConfig;

  return (
    <MobileMenuProvider>
      <header>
        <div
          className={cn(
            'lp:!max-w-[1290px] fixed top-5 left-1/2 z-50 mx-auto flex w-full max-w-[320px] -translate-x-1/2 items-center justify-between rounded-full px-2.5 py-2.5 transition-all duration-500 ease-in-out min-[425px]:max-w-[375px] min-[500px]:max-w-[450px] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] xl:py-0',
            className,
            isScrolled && 'lg:top-2 top-2 transition-all duration-500 ease-in-out',
          )}
        >
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden items-center xl:flex">
            <ul className="flex items-center gap-6">
              {navigationItems.map((item) => (
                <li key={item.id} className={cn('py-2.5', navItemClass)}>
                  <NavItemLink item={item} />
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA Button → nutzt zentrale headerConfig */}
          <NavCTAButton
            href={cta.href}
            label={cta.label}
            btnClassName={cn(
              'btn btn-primary bg-[var(--color-primary-500)] text-white hover:opacity-80',
              btnClassName,
            )}
          />

          {/* Mobile Menu Button */}
          <MobileMenuButton />
        </div>

        <MobileMenu />
      </header>
    </MobileMenuProvider>
  );
};

NavbarOne.displayName = 'NavbarOne';
export default NavbarOne;
