import FinanceIntro from '@/components/aboutpage-02/FinanceIntro';
import OurMission from '@/components/aboutpage-02/OurMission';
import Reviews from '@/components/aboutpage-02/Reviews';
import VisionStatement from '@/components/aboutpage-02/VisionStatement';
import TrustedByUsers from '@/components/homepage-07/TrustedByUsers';
import CTAV2 from '@/components/shared/cta/CTAV2';

import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarOne from '@/components/shared/header/NavbarOne';
import PageHero from '@/components/shared/PageHero';
import { defaultMetadata } from '@/utils/generateMetaData';
import { Metadata } from 'next';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Über Pilar Systems – Unsere Vision für moderne Fitnessstudios',
  description:
    'Erfahre, warum Pilar Systems gebaut wurde: um Telefonstress, Zettelchaos und verlorene Leads in Fitnessstudios zu beenden – mit einer KI-Infrastruktur, die wirklich in den Studioalltag passt.',
};

const AboutPage02 = () => {
  return (
    <>
      <NavbarOne
        megaMenuColor="!bg-background-3 dark:!bg-background-7"
        className="dark:border bg-accent/60 dark:border-stroke-7 dark:bg-background-7 backdrop-blur-[25px]"
        btnClassName="btn-secondary dark:btn-accent hover:btn-white dark:hover:btn-white-dark"
      />

      <main className="bg-white dark:bg-background-8">
        <PageHero
          title="Über uns"
          heading="Pilar Systems – gebaut für Studios, die mehr wollen als nur eine Software."
          link="/about-02"
          className="pt-24 md:pt-32 lg:pt-40 xl:pt-[200px]"
        />

        <VisionStatement />

        <TrustedByUsers
          className="pb-14 pt-14 md:pb-16 md:pt-16 lg:pb-[88px] lg:pt-[88px] xl:pb-[100px] xl:pt-[100px]"
          title="Studios, die auf Automatisierung setzen"
          description="Pilar Systems wird für Studios gebaut, die ihre Prozesse ernst nehmen: weniger Zufall an der Rezeption, mehr Planbarkeit bei Leads, Probetrainings und Verträgen."
        />

        <OurMission />

        <TrustedByUsers
          className="pb-14 pt-14 md:pb-16 md:pt-16 lg:pb-[88px] lg:pt-[88px] xl:pb-[100px] xl:pt-[100px]"
          title="Gemeinsam wachsen"
          description="Wir verstehen uns nicht als Agentur, sondern als Infrastruktur-Partner: Dein Studio liefert die Vision – Pilar sorgt für die Prozesse dahinter."
        />

        <FinanceIntro />
        <Reviews />

        <CTAV2
          ctaHeading="Bereit, dein Studio auf Automatisierung umzustellen?"
          ctaDescription="Erstelle deinen Account, wähle deinen Plan und starte mit dem Setup-Wizard. In wenigen Tagen arbeitet deine KI im Hintergrund – und dein Team kann sich auf Training und Betreuung konzentrieren."
          ctaBtnText="Jetzt Account erstellen"
          ctaCheckListData={[
            {
              id: '1',
              text: 'Kein Technik-Wissen notwendig – geführtes Setup',
            },
            {
              id: '2',
              text: 'Faire Setup-Gebühr + planbare monatliche Lizenz',
            },
            {
              id: '3',
              text: 'Jederzeit Upgrade auf Pro, Elite & Add-ons möglich',
            },
          ]}
        />
      </main>

      <FooterOne />
    </>
  );
};

AboutPage02.displayName = 'AboutPage02';
export default AboutPage02;
