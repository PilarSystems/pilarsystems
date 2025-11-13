import Link from 'next/link';
import MobileMenuItem from './MobileMenuItem';

const IntegrationMenu = () => {
  return (
    <MobileMenuItem id="integration" title="Integrationen" hasSubmenu={true}>
      <ul>
        <li>
          <Link
            href="/integration-01"
            className="text-tagline-1 text-secondary/60 dark:text-accent/60 border-stroke-4 dark:border-stroke-6 block w-full border-b py-3 text-left font-normal transition-all duration-200 hover:text-primary-500 dark:hover:text-primary-300">
            Integration 01
          </Link>
        </li>
        <li>
          <Link
            href="/integration-02"
            className="text-tagline-1 text-secondary/60 dark:text-accent/60 block w-full py-3 text-left font-normal transition-all duration-200 hover:text-primary-500 dark:hover:text-primary-300">
            Integration 02
          </Link>
        </li>
      </ul>
    </MobileMenuItem>
  );
};

export default IntegrationMenu;
