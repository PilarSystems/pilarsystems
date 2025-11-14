import Client from '@/components/signup-01/Client';
import Faq from '@/components/signup-01/Faq';
import Pricing from '@/components/signup-01/Pricing';
import CTAV1 from '@/components/shared/cta/CTAV1';
import FooterThree from '@/components/shared/footer/FooterThree';
import NavbarOne from '@/components/shared/header/NavbarOne';
import PageHero from '@/components/shared/PageHero';
import { defaultMetadata } from '@/utils/generateMetaData';
import { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Preise – Pilar Systems',
};

const Pricing03 = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-white-dark dark:hover:btn-white"
      />
      <main className="bg-background-1 dark:bg-background-6">
        <PageHero
          title="Preise"
          heading="Preise & Pläne für dein Studio"
          link="/signup-01"
        />

        <Pricing />

        <Client />

        <Faq />

        <CTAV1
          className="dark:bg-background-7 bg-accent"
          badgeText="Jetzt starten"
          badgeClass="!badge-cyan"
          ctaHeading="Bereit, deine Studio-Rezeption zu automatisieren?"
          description="Wir zeigen dir in einem gemeinsamen Gespräch, wie Pilar Systems in deinen Alltag passt – von ersten Anfragen bis zur Vertragsunterschrift."
          ctaBtnText="Kostenloses Erstgespräch buchen"
          btnClass="btn-primary hover:btn-secondary dark:hover:btn-accent"
        />
      </main>
      <FooterThree className="dark:!bg-background-6" />
    </Fragment>
  );
};

Pricing03.displayName = 'Pricing03';
export default Pricing03;
