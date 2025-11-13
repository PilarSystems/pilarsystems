import Link from 'next/link';
import MobileMenuItem from './MobileMenuItem';

const PricingMenu = () => {
  return (
    <MobileMenuItem id="pricing" title="Preise" hasSubmenu={true}>
      <ul>
        <li>
          <Link
            href="/pricing-03"
            className="text-tagline-1 text-secondary/60 dark:text-accent/60 block w-full py-3 text-left font-normal transition-all duration-200 hover:text-primary-500 dark:hover:text-primary-300">
            Preise & Pakete
          </Link>
        </li>
      </ul>
    </MobileMenuItem>
  );
};

PricingMenu.displayName = 'PricingMenu';
export default PricingMenu;
