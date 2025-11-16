import Client from '@/components/pricing-02/Client';
import Faq from '@/components/pricing-02/Faq';
import Pricing from '@/components/pricing-02/Pricing';
import CTAV1 from '@/components/shared/cta/CTAV1';
import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarOne from '@/components/shared/header/NavbarOne';
import PageHero from '@/components/shared/PageHero';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Preise & Pläne – Pilar Systems',
  description:
    'Übersicht aller Pilar Systems Tarife: Basic, Pro und Elite. Einmalige Setup-Gebühr plus monatliche Lizenz – speziell für Fitnessstudios, Coaches & Studios.',
};

const Pricing02 = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
        megaMenuColor="!bg-accent dark:!bg-background-9"
      />
      <main className="bg-background-1 dark:bg-background-6">
        <PageHero
          title="Preise"
          heading="Preise & Pläne"
          link="/pricing-02"
          className="pt-24 md:pt-32 lg:pt-40 xl:pt-[200px]"
        />

        {/* Haupt-Pricing-Sektion */}
        <Pricing />

        {/* Vertrauen / Value-Block */}
        <Client />

        {/* FAQ */}
        <Faq />

        {/* Abschluss-CTA */}
        <CTAV1
          className="dark:bg-background-5 bg-background-1"
          badgeText="Nächster Schritt"
          badgeClass="!badge-green"
          ctaHeading="Starte jetzt mit deiner KI-Infrastruktur fürs Studio."
          description="Buche deinen Plan, schließe das Setup ab und lass Pilar Systems Anfragen, Follow-ups und Trainingspläne übernehmen – während dein Team sich auf die Fläche konzentriert."
          ctaBtnText="Jetzt Pilar testen"
          btnClass="btn-primary hover:btn-secondary dark:hover:btn-accent"
        />
      </main>
      <FooterOne />
    </Fragment>
  );
};

Pricing02.displayName = 'Pricing02';
export default Pricing02;
