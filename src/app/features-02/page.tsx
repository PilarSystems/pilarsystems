import Features from '@/components/features-02/Features';
import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarOne from '@/components/shared/header/NavbarOne';
import PageHero from '@/components/shared/PageHero';
import { defaultMetadata } from '@/utils/generateMetaData';
import { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Funktionen – Pilar Systems',
  description:
    'Alle Module von Pilar Systems im Überblick: KI-Telefonanlage, WhatsApp & E-Mail-Inbox, Terminbuchung, Trainingspläne, Coach, Growth-Analytics, White-Label und mehr.',
};

const Features02 = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />

      <main className="bg-background-2 dark:bg-background-5">
        <PageHero
          title="Funktionen"
          className="pt-24 md:pt-36 lg:pt-40 xl:pt-[200px]"
          heading="Alle Funktionen von Pilar Systems im Überblick."
          link="/features-02"
        />

        {/* Haupt-Feature-Grid */}
        <Features />
      </main>

      <FooterOne className="border-t border-t-[#303032] dark:border-t-0 max-sm:z-[11]" />
    </Fragment>
  );
};

export default Features02;
