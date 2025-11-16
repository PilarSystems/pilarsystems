import Link from 'next/link';
import MobileMenuItem from './MobileMenuItem';

const IntegrationMenu = () => {
  return (
    <MobileMenuItem id="integration" title="Integrationen" hasSubmenu={false}>
      <ul>
        <li>
          <Link
            href="/integration-01"
            className="text-tagline-1 text-secondary/60 dark:text-accent/60 block w-full py-3 text-left font-normal transition-all duration-200 hover:text-primary-500 dark:hover:text-primary-300"
          >
            Integrationen Übersicht
          </Link>
        </li>
      </ul>
    </MobileMenuItem>
  );
};

export default IntegrationMenu;
