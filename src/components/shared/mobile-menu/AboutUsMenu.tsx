import Link from 'next/link';
import MobileMenuItem from './MobileMenuItem';

const AboutUsMenu = () => {
  return (
    <MobileMenuItem id="about" title="Über uns" hasSubmenu={true}>
      <ul>
        <li>
          <Link
            href="/about-01"
            className="text-tagline-1 text-secondary/60 dark:text-accent/60 block w-full py-3 text-left font-normal transition-all duration-200 hover:text-primary-500 dark:hover:text-primary-300">
            Über Pilar Systems
          </Link>
        </li>
      </ul>
    </MobileMenuItem>
  );
};

AboutUsMenu.displayName = 'AboutUsMenu';
export default AboutUsMenu;
