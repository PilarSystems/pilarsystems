import Link from 'next/link';
import MobileMenuItem from './MobileMenuItem';

const ProcessMenu = () => {
  return (
    <MobileMenuItem id="process" title="Ablauf" hasSubmenu={true}>
      <ul>
        <li>
          <Link
            href="/process-01"
            className="text-tagline-1 text-secondary/60 dark:text-accent/60 block w-full py-3 text-left font-normal transition-all duration-200 hover:text-primary-500 dark:hover:text-primary-300">
            So funktioniert Pilar Systems
          </Link>
        </li>
      </ul>
    </MobileMenuItem>
  );
};

ProcessMenu.displayName = 'ProcessMenu';
export default ProcessMenu;
