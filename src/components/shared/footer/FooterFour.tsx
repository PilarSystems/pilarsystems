import RevealAnimation from '@/components/animation/RevealAnimation';
import { cn } from '@/utils/cn';
import gradient44 from '@public/images/gradient/gradient-44.png';
import behance from '@public/images/icons/behance.svg';
import dribbble from '@public/images/icons/dribbble.svg';
import facebook from '@public/images/icons/facebook.svg';
import instagram from '@public/images/icons/instagram.svg';
import linkedin from '@public/images/icons/linkedin.svg';
import youtube from '@public/images/icons/youtube.svg';
import darkLogo from '@public/images/shared/dark-logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';
import FooterDivider from './FooterDivider';

const FooterFour = ({ className }: { className?: string }) => {
  return (
    <footer className={cn('bg-secondary dark:bg-background-8 relative z-0 overflow-hidden', className)}>
      <RevealAnimation delay={0.3} offset={50} direction="up">
        <figure className="pointer-events-none absolute -top-[1320px] left-1/2 -z-1 size-[1635px] -translate-x-1/2 select-none">
          <Image src={gradient44} alt="Footer gradient" className="size-full object-cover" />
        </figure>
      </RevealAnimation>

      <div className="main-container px-5">
        <div className="grid grid-cols-12 justify-between gap-x-0 gap-y-16 pt-16 pb-12 xl:pt-[90px]">
          {/* Brand / Intro */}
          <RevealAnimation delay={0.1}>
            <div className="col-span-12 xl:col-span-4">
              <div className="max-w-[306px]">
                <figure>
                  <Image src={darkLogo} alt="Pilar Systems Logo" />
                </figure>
                <p className="text-accent/60 text-tagline-1 mt-4 mb-7 font-normal">
                  Pilar Systems bringt KI an deinen Studioempfang: Leads, Mitglieder, Termine und Fragen werden
                  automatisch bearbeitet – passend zu deinem Branding und deinen Prozessen.
                </p>
                <div className="flex items-center gap-3">
                  <Link target="_blank" href="https://www.facebook.com">
                    <span className="sr-only">Facebook</span>
                    <Image className="size-6" src={facebook} alt="Facebook" />
                  </Link>
                  <div className="bg-stroke-1/20 h-6 w-px" />
                  <Link target="_blank" href="https://www.instagram.com">
                    <span className="sr-only">Instagram</span>
                    <Image className="size-6" src={instagram} alt="Instagram" />
                  </Link>
                  <div className="bg-stroke-1/20 h-6 w-px" />
                  <Link target="_blank" href="https://www.youtube.com">
                    <span className="sr-only">Youtube</span>
                    <Image className="size-6" src={youtube} alt="Youtube" />
                  </Link>
                  <div className="bg-stroke-1/20 h-6 w-px" />
                  <Link target="_blank" href="https://www.linkedin.com">
                    <span className="sr-only">LinkedIn</span>
                    <Image className="size-6" src={linkedin} alt="LinkedIn" />
                  </Link>
                  <div className="bg-stroke-1/20 h-6 w-px" />
                  <Link target="_blank" href="https://www.dribbble.com">
                    <span className="sr-only">Dribbble</span>
                    <Image className="size-6" src={dribbble} alt="Dribbble" />
                  </Link>
                  <div className="bg-stroke-1/20 h-6 w-px" />
                  <Link target="_blank" href="https://www.behance.net">
                    <span className="sr-only">Behance</span>
                    <Image className="size-6" src={behance} alt="Behance" />
                  </Link>
                </div>
              </div>
            </div>
          </RevealAnimation>

          {/* Link-Spalten */}
          <div className="col-span-12 grid grid-cols-12 gap-x-0 gap-y-8 xl:col-span-8">
            {/* Unternehmen */}
            <div className="col-span-12 md:col-span-4">
              <RevealAnimation delay={0.2}>
                <div className="space-y-8">
                  <p className="sm:text-heading-6 text-tagline-1 text-primary-50 font-normal">Unternehmen</p>
                  <ul className="space-y-5">
                    <li>
                      <Link href="/our-team-02" className="footer-link">
                        Über Pilar
                      </Link>
                    </li>
                    <li>
                      <Link href="/process-01" className="footer-link">
                        Ablauf &amp; Setup
                      </Link>
                    </li>
                    <li>
                      <Link href="/case-study" className="footer-link">
                        Erfolgsgeschichten
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact-us" className="footer-link">
                        Kontakt
                      </Link>
                    </li>
                  </ul>
                </div>
              </RevealAnimation>
            </div>

            {/* Produkt */}
            <div className="col-span-12 md:col-span-4">
              <RevealAnimation delay={0.3}>
                <div className="space-y-8">
                  <p className="sm:text-heading-6 text-tagline-1 text-primary-50 font-normal">Produkt</p>
                  <ul className="space-y-5">
                    <li>
                      <Link href="/" className="footer-link">
                        Startseite
                      </Link>
                    </li>
                    <li>
                      <Link href="/signup-01" className="footer-link">
                        Preise &amp; Pläne
                      </Link>
                    </li>
                    <li>
                      <Link href="/login-04" className="footer-link">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link href="/sign-up-04" className="footer-link">
                        Account anlegen
                      </Link>
                    </li>
                  </ul>
                </div>
              </RevealAnimation>
            </div>

            {/* Rechtliches */}
            <div className="col-span-12 md:col-span-4">
              <RevealAnimation delay={0.4}>
                <div className="space-y-8">
                  <p className="sm:text-heading-6 text-tagline-1 text-primary-50 font-normal">Rechtliches</p>
                  <ul className="space-y-5">
                    <li>
                      <Link href="/terms-conditions" className="footer-link">
                        AGB
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy" className="footer-link">
                        Datenschutz
                      </Link>
                    </li>
                    <li>
                      <Link href="/imprint" className="footer-link">
                        Impressum
                      </Link>
                    </li>
                    <li>
                      <Link href="/gdpr" className="footer-link">
                        DSGVO-Infos
                      </Link>
                    </li>
                  </ul>
                </div>
              </RevealAnimation>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative pt-[26px] pb-[42px] text-center">
          <FooterDivider className="bg-accent/10 dark:bg-stroke-6" />
          <RevealAnimation delay={0.7} offset={10} start="top 105%">
            <p className="text-tagline-1 text-primary-50 font-normal">
              © {new Date().getFullYear()} Pilar Systems – KI-Rezeptionist für Fitnessstudios.
            </p>
          </RevealAnimation>
        </div>
      </div>

      <ThemeToggle />
    </footer>
  );
};

export default FooterFour;
