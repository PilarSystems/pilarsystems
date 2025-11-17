import AffiliateProcess from '@/components/affiliates/AffiliateProcess';
import AffiliateProgram from '@/components/affiliates/AffiliateProgram';
import CTAV1 from '@/components/shared/cta/CTAV1';
import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarOne from '@/components/shared/header/NavbarOne';
import PageHero from '@/components/shared/PageHero';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Affiliate-Programm – PILAR SYSTEMS',
  description:
    'Werde Affiliate von PILAR SYSTEMS und verdiene wiederkehrende Provisionen mit Fitnessstudios, Gyms & Coaches, die unsere KI-Infrastruktur nutzen.',
};

const AffiliatePage = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />
      <main className="bg-background-3 dark:bg-background-7">
        <PageHero
          title="Affiliate-Programm"
          heading="Verdiene mit PILAR SYSTEMS wiederkehrende Provisionen."
          link="/affiliate"
        />

        {/* Programm-Übersicht: Konditionen, Zielgruppe, Vorteile */}
        <AffiliateProgram />

        {/* Ablauf: So funktioniert das PILAR Affiliate-Setup */}
        <AffiliateProcess />

        <CTAV1
          className="dark:bg-background-5 bg-white"
          badgeClass="!badge-yellow-v2"
          badgeText="Affiliate werden"
          ctaHeading="Bereit, mit Studios & Coaches gemeinsam zu skalieren?"
          description="Bewirb dich als Affiliate-Partner von PILAR SYSTEMS, teile deinen persönlichen Empfehlungslink und verdiene wiederkehrende Provisionen für jedes aktive Studio, das über dich zu PILAR wechselt."
          btnClass="hover:btn-secondary dark:hover:btn-accent"
          ctaBtnText="Jetzt Affiliate-Anfrage senden"
        />
      </main>
      <FooterOne />
    </Fragment>
  );
};

export default AffiliatePage;
