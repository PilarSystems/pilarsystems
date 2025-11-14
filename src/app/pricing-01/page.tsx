// src/app/pricing-01/page.tsx

import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterThree from '@/components/shared/footer/FooterThree';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';

// WICHTIG: wieder auf pricing-02 zeigen, NICHT signup-01
import Benefits from '@/components/pricing-01/Benefits';
import Contact from '@/components/pricing-01/Contact';
import Features from '@/components/pricing-01/Features';
import Pricing from '@/components/pricing-01/Pricing';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Pricing – Pilar Systems',
};

const PricingPage01 = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />

      <main className="bg-background-3 dark:bg-background-7">
        <Benefits />
        <Features />
        <Pricing />
        <Contact />
      </main>

      <FooterThree />
    </Fragment>
  );
};

export default PricingPage01;
