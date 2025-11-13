import Link from 'next/link';
import MobileMenuItem from './MobileMenuItem';

const TeamsMenu = () => {
  return (
    <MobileMenuItem id="teams" title="Team" hasSubmenu={true}>
      <ul>
        <li>
          <Link
            href="/our-team-02"
            className="text-tagline-1 text-secondary/60 dark:text-accent/60 block w-full py-3 text-left font-normal transition-all duration-200 hover:text-primary-500 dark:hover:text-primary-300">
            Unser Team
          </Link>
        </li>
      </ul>
    </MobileMenuItem>
  );
};

TeamsMenu.displayName = 'TeamsMenu';
export default TeamsMenu;
