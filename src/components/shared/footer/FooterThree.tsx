import Link from 'next/link';
import { cn } from '@/utils/cn';

interface FooterThreeProps {
  className?: string;
}

const FooterThree = ({ className }: FooterThreeProps) => {
  return (
    <footer
      className={cn(
        'bg-background-1 dark:bg-background-8 border-t border-stroke-2 dark:border-stroke-6',
        className,
      )}>
      <div className="main-container py-10 md:py-14 lg:py-16">
        <div className="grid grid-cols-12 gap-y-10 md:gap-y-12 gap-x-8">
          {/* Brand / Intro */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4 space-y-3">
            <p className="text-heading-6 md:text-heading-5">Pilar Systems</p>
            <p className="text-secondary/60 dark:text-accent/60 text-sm md:text-[15px] max-w-[360px]">
              Dein KI-Rezeptionist für Fitnessstudios: Anfragen, Probetrainings, Trainingspläne und Mitglieder-Handling –
              alles in einem System, das wirklich in den Studioalltag passt.
            </p>
          </div>

          {/* Produkt */}
          <div className="col-span-6 md:col-span-3 lg:col-span-2">
            <h4 className="text-tagline-1 font-semibold mb-3 text-secondary dark:text-accent">Produkt</h4>
            <ul className="space-y-2 text-sm md:text-[15px]">
              <li>
                <Link
                  href="/"
                  className="text-secondary/70 dark:text-accent/70 hover:text-secondary dark:hover:text-accent">
                  Startseite
                </Link>
              </li>
              <li>
                <Link
                  href="/signup-01"
                  className="text-secondary/70 dark:text-accent/70 hover:text-secondary dark:hover:text-accent">
                  Preise & Pläne
                </Link>
              </li>
              <li>
                <Link
                  href="/process-01"
                  className="text-secondary/70 dark:text-accent/70 hover:text-secondary dark:hover:text-accent">
                  Ablauf & Setup
                </Link>
              </li>
              <li>
                <Link
                  href="/case-study"
                  className="text-secondary/70 dark:text-accent/70 hover:text-secondary dark:hover:text-accent">
                  Erfolgsgeschichten
                </Link>
              </li>
            </ul>
          </div>

          {/* Unternehmen */}
          <div className="col-span-6 md:col-span-2 lg:col-span-2">
            <h4 className="text-tagline-1 font-semibold mb-3 text-secondary dark:text-accent">Unternehmen</h4>
            <ul className="space-y-2 text-sm md:text-[15px]">
              <li>
                <Link
                  href="/our-team-02"
                  className="text-secondary/70 dark:text-accent/70 hover:text-secondary dark:hover:text-accent">
                  Über Pilar
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-secondary/70 dark:text-accent/70 hover:text-secondary dark:hover:text-accent">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link
                  href="/login-04"
                  className="text-secondary/70 dark:text-accent/70 hover:text-secondary dark:hover:text-accent">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up-04"
                  className="text-secondary/70 dark:text-accent/70 hover:text-secondary dark:hover:text-accent">
                  Account anlegen
                </Link>
              </li>
            </ul>
          </div>

          {/* Support / Rechtliches */}
          <div className="col-span-12 md:col-span-4 lg:col-span-4">
            <h4 className="text-tagline-1 font-semibold mb-3 text-secondary dark:text-accent">Support & Rechtliches</h4>
            <ul className="space-y-2 text-sm md:text-[15px]">
              <li>
                <Link
                  href="/signup-01#faq"
                  className="text-secondary/70 dark:text-accent/70 hover:text-secondary dark:hover:text-accent">
                  Fragen zu Preisen
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-secondary/70 dark:text-accent/70 hover:text-secondary dark:hover:text-accent">
                  Support kontaktieren
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-secondary/50 dark:text-accent/50 text-xs md:text-[13px] max-w-[360px]">
              Individuelle Anforderungen, mehrere Standorte oder spezielle Prozesse? Sprich uns an – wir planen mit dir
              ein Setup, das zu deinem Studio passt.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-stroke-2 dark:border-stroke-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-secondary/60 dark:text-accent/60 text-xs md:text-[13px]">
            © {new Date().getFullYear()} Pilar Systems. Alle Rechte vorbehalten.
          </p>
          <div className="flex flex-wrap gap-4 text-xs md:text-[13px]">
            <Link
              href="/"
              className="text-secondary/60 dark:text-accent/60 hover:text-secondary dark:hover:text-accent">
              Datenschutz
            </Link>
            <span className="text-secondary/40 dark:text-accent/40">•</span>
            <Link
              href="/"
              className="text-secondary/60 dark:text-accent/60 hover:text-secondary dark:hover:text-accent">
              Impressum
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

FooterThree.displayName = 'FooterThree';
export default FooterThree;
