import logoDark from '@public/images/shared/logo-dark.svg';
import logo from '@public/images/shared/logo.svg';
import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
  return (
    <div>
      <Link href="/homepage-18" className="flex items-center gap-2">
        <span className="sr-only">Pilar Systems – Home</span>

        {/* Desktop: Icon + Schriftzug */}
        <figure className="hidden lg:block max-w-[32px]">
          <Image src={logo} alt="Pilar Systems Logo" className="block w-full dark:hidden" />
          <Image src={logoDark} alt="Pilar Systems Logo" className="hidden w-full dark:block" />
        </figure>
        <span
  className="hidden lg:inline-block text-base font-semibold tracking-tight bg-clip-text text-transparent"
  style={{
    backgroundImage: 'var(--color-gradient-pilar)',
  }}
>
  Pilar Systems
</span>


        {/* Mobile: nur Icon */}
        <figure className="block max-w-[44px] lg:hidden">
          <Image src={logo} alt="Pilar Systems Logo" className="block w-full dark:hidden" />
          <Image src={logoDark} alt="Pilar Systems Logo" className="hidden w-full dark:block" />
        </figure>
      </Link>
    </div>
  );
};

export default Logo;
