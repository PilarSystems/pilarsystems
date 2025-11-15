// src/app/testimonial-01/page.tsx
import Reviews from '@/components/homepage-09/Reviews';
import Client from '@/components/pricing-02/Client';
import CTAV1 from '@/components/shared/cta/CTAV1';
import FooterThree from '@/components/shared/footer/FooterThree';
import NavbarOne from '@/components/shared/header/NavbarOne';
import PageHero from '@/components/shared/PageHero';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Erfahrungen & Stimmen – Pilar Systems',
};

const Testimonial01 = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-white-dark dark:hover:btn-white"
      />

      <main className="bg-background-1 dark:bg-background-6">
        <PageHero
          title="Erfahrungen"
          heading="Was Studios über Pilar Systems sagen"
          link="/testimonial-01"
        />

        {/* Testimonials-Karussell / Grid */}
        <Reviews />

        {/* Logos / Marken-Block */}
        <Client />

        {/* Call to Action */}
        <CTAV1
          className="dark:bg-background-7 bg-accent"
          badgeText="Jetzt starten"
          badgeClass="!badge-cyan"
          ctaHeading="Bereit, deine Studio-Rezeption zu automatisieren?"
          description="Erlebe, wie sich dein Alltag verändert, wenn Anfragen, Termine und Antworten nicht mehr an Menschen gebunden sind – sondern an ein System."
          ctaBtnText="Kostenloses Erstgespräch buchen"
          btnClass="btn-primary hover:btn-secondary dark:hover:btn-accent"
        />
      </main>

      <FooterThree className="dark:!bg-background-6" />
    </Fragment>
  );
};

Testimonial01.displayName = 'Testimonial01';

export default Testimonial01;
