import Link from 'next/link';
import MobileMenuItem from './MobileMenuItem';

const SignUpMenu = () => {
  return (
    <MobileMenuItem id="signup" title="Registrieren" hasSubmenu={true}>
      <ul>
        <li>
          <Link
            href="/signup-03"
            className="text-tagline-1 text-secondary/60 dark:text-accent/60 block w-full py-3 text-left font-normal transition-all duration-200 hover:text-primary-500 dark:hover:text-primary-300">
            Account erstellen
          </Link>
        </li>
      </ul>
    </MobileMenuItem>
  );
};

SignUpMenu.displayName = 'SignUpMenu';
export default SignUpMenu;
