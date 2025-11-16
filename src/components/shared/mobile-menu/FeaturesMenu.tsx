import Link from 'next/link';
import MobileMenuItem from './MobileMenuItem';

const FeaturesMenu = () => {
  return (
    <MobileMenuItem id="features" title="Funktionen" hasSubmenu={false}>
      <ul>
        <li>
          <Link
            href="/features-02"
            className="text-tagline-1 text-secondary/60 dark:text-accent/60 block w-full py-3 text-left font-normal transition-all duration-200 hover:text-primary-500 dark:hover:text-primary-300"
          >
            Alle Funktionen im Überblick
          </Link>
        </li>
      </ul>
    </MobileMenuItem>
  );
};

FeaturesMenu.displayName = 'FeaturesMenu';
export default FeaturesMenu;
