import CaseStudy from '@/components/case-study/CaseStudy';
import Feature from '@/components/case-study/Feature';
import Success from '@/components/case-study/Success';
import CTAV1 from '@/components/shared/cta/CTAV1';
import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarOne from '@/components/shared/header/NavbarOne';
import PageHero from '@/components/shared/PageHero';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Erfolgsgeschichten – PILAR SYSTEMS',
  description:
    'Erfolgsgeschichten von Fitnessstudios, Gyms und Coaches, die mit der KI-Infrastruktur von PILAR SYSTEMS mehr Leads, Probetrainings und Abschlüsse erzielen.',
};

const CaseStudyPage = () => {
  return (
    <>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />
      <main className="bg-background-3 dark:bg-background-7">
        <PageHero
          title="Erfolgsgeschichten"
          heading="Wie Studios mit PILAR SYSTEMS arbeiten."
          link="/case-study"
          className="pt-24 md:pt-36 lg:pt-40 xl:pt-[200px]"
        />

        <CaseStudy />
        <Success />
        <Feature />

        <CTAV1
          className="dark:bg-background-5 bg-white"
          badgeClass="!badge-yellow-v2"
          badgeText="Nächster Schritt"
          ctaHeading="Dein Studio könnte die nächste Erfolgsgeschichte sein."
          description="Sprich mit uns über dein Studio-Setup oder starte direkt mit Basic oder Pro – PILAR SYSTEMS übernimmt Leads, Terminbuchung und Follow-ups."
          ctaBtnText="Jetzt Pilar testen"
          btnClass="hover:btn-secondary dark:hover:btn-accent"
        />
      </main>
      <FooterOne />
    </>
  );
};

CaseStudyPage.displayName = 'CaseStudyPage';
export default CaseStudyPage;
