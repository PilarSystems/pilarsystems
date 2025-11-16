import Counter from '@/components/homepage-18/Counter';
import CTA from '@/components/homepage-18/CTA';
import Feature from '@/components/homepage-18/Feature';
import Hero from '@/components/homepage-18/Hero';
import Integration from '@/components/homepage-18/Integration';
import Pricing from '@/components/homepage-18/Pricing';
import Projects from '@/components/homepage-18/Projects';
import Services from '@/components/homepage-18/Services';
import Testimonial from '@/components/homepage-18/Testimonial';
import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarOne from '@/components/shared/header/NavbarOne';
import { defaultMetadata } from '@/utils/generateMetaData';
import { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'PILAR SYSTEMS – KI-Infrastruktur für Fitnessstudios & Coaches',
  description:
    'PILAR SYSTEMS automatisiert Telefon, WhatsApp, E-Mail und DMs, qualifiziert Leads, bucht Probetrainings, erstellt Trainingspläne und liefert Growth-Analytics – eine komplette KI-Infrastruktur für Fitnessstudios und Coaches.',
};

const Homepage18 = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
        megaMenuColor="!bg-background-3 dark:!bg-background-9"
      />
      <main className="bg-background-2 dark:bg-background-5">
        <Hero />
        <Feature />
        <Services />
        <Integration />
        <Projects />
        <Counter />
        <Testimonial />
        <Pricing />
        <CTA />
      </main>
      <FooterOne className="border-t border-t-[#303032] dark:border-t-0 max-sm:z-[11]" />
    </Fragment>
  );
};

export default Homepage18;
