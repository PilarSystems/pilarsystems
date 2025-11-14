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

interface NavbarOneProps {
  className?: string;
  megaMenuColor?: string;
  btnClassName?: string;
  navItemClass?: string;
}

// Custom Navigation für Pilar Systems – TS-kompatibel mit NavigationItem
const navigationItems = [
  { id: 'home', label: 'Home', href: '/homepage-18', hasDropdown: false },
  { id: 'features', label: 'Funktionen', href: '/features-02', hasDropdown: false },
  { id: 'about', label: 'Über uns', href: '/about-02', hasDropdown: false },
  { id: 'pricing', label: 'Preise', href: '/signup-01', hasDropdown: false },
  { id: 'customers', label: 'Kunden', href: '/testimonial-02', hasDropdown: false },
  { id: 'login', label: 'Login', href: '/login-01', hasDropdown: false },
];

const NavbarOne: FC<NavbarOneProps> = ({ className, btnClassName }) => {
  const { isScrolled } = useNavbarScroll(100);

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
                <li key={item.id} className="py-2.5">
                  <NavItemLink item={item} />
                </li>
              ))}
            </ul>
          </nav>

          {/* CTA Button */}
          <NavCTAButton
  href="/signup-01"
  btnClassName="btn btn-primary bg-[var(--color-primary-500)] text-white hover:opacity-80"
  label="Jetzt starten"
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
