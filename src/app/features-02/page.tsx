import Features from '@/components/features-02/Features';
import WhyChooseUs from '@/components/homepage-07/WhyChooseUs';
import Feature from '@/components/our-services-03/Feature';
import CTAV1 from '@/components/shared/cta/CTAV1';
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
    'Alle Module von Pilar Systems im Überblick: KI-Inbox, Telefonanlage, WhatsApp, E-Mail, Terminbuchung, Trainingspläne, Growth-Analytics, KI-Coach und mehr.',
};

const Features02 = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />
      <main className="bg-background-3 dark:bg-background-7">
        <PageHero
          title="Funktionen"
          className="pt-24 md:pt-36 lg:pt-40 xl:pt-[200px]"
          heading="Was Pilar Systems in deinem Studio übernimmt."
          link="/features-02"
        />
        {/* Haupt-Feature-Grid: alle Kernmodule von PILAR */}
        <Features />

        {/* Zusatzsektion: Services-Teaser (lassen wir fürs Layout, später bei Bedarf umlabeln) */}
        <Feature btnClassName="btn-accent dark:btn-dark hover:btn-primary border-0 btn-md btn" />

        {/* WhyChooseUs enthält bereits gute Struktur – Content später pilarisieren */}
        <WhyChooseUs className="dark:bg-background-7" />

        {/* Reviews/Trust – lassen wir vorerst, später mit echten Studio-Stories füllen */}
        {/* Optional: Wenn du sie schon auf anderen Seiten nutzt, können wir hier später Pilar-spezifische Testimonials einbauen */}

        <CTAV1
          className="dark:bg-background-6 bg-white"
          badgeClass="hidden"
          ctaHeading="Bereit, Telefonstress & Zettelwirtschaft zu ersetzen?"
          spanText="PILAR SYSTEMS"
          description="Starte mit Basic oder Pro und lass KI Telefon, WhatsApp, E-Mail, Follow-ups, Trainingspläne und Growth-Analysen für dein Studio übernehmen – ohne lange Onboarding-Calls."
          btnClass="hover:btn-secondary dark:hover:btn-accent"
          ctaBtnText="Jetzt Pilar testen"
        />
      </main>
      <FooterOne />
    </Fragment>
  );
};

export default Features02;
