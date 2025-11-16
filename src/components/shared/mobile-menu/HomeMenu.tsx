import Link from 'next/link';
import MobileMenuItem from './MobileMenuItem';

const HomeMenu = () => {
  return (
    <MobileMenuItem id="home" title="Home" hasSubmenu={false}>
      <ul>
        <li>
          <Link
            href="/homepage-18"
            className="text-tagline-1 text-secondary/60 dark:text-accent/60 block w-full py-3 text-left font-normal transition-all duration-200 hover:text-primary-500 dark:hover:text-primary-300"
          >
            Pilar Systems Startseite
          </Link>
        </li>
      </ul>
    </MobileMenuItem>
  );
};

HomeMenu.displayName = 'HomeMenu';
export default HomeMenu;
