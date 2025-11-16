import Link from 'next/link';
import MobileMenuItem from './MobileMenuItem';

const ServicesMenu = () => {
  return (
    <MobileMenuItem id="services" title="Warum Pilar?" hasSubmenu={false}>
      <ul>
        <li>
          <Link
            href="/homepage-18#services"
            className="text-tagline-1 text-secondary/60 dark:text-accent/60 block w-full py-3 text-left font-normal transition-all duration-200 hover:text-primary-500 dark:hover:text-primary-300"
          >
            Warum Pilar Systems?
          </Link>
        </li>
      </ul>
    </MobileMenuItem>
  );
};

ServicesMenu.displayName = 'ServicesMenu';
export default ServicesMenu;
