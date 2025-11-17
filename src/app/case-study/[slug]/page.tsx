import CaseStudyDetails from '@/components/case-study/CaseStudyDetails';
import CTAV1 from '@/components/shared/cta/CTAV1';
import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarOne from '@/components/shared/header/NavbarOne';
import PageHero from '@/components/shared/PageHero';
import { defaultMetadata } from '@/utils/generateMetaData';
import getMarkDownData from '@/utils/getMarkDownData';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const caseStudies = getMarkDownData('src/data/case-study');
  return caseStudies.map((post) => ({
    slug: post.slug,
  }));
}

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Erfolgsgeschichte – PILAR SYSTEMS',
  description:
    'Erfolgsgeschichten von Fitnessstudios, Gyms und Coaches, die mit der KI-Infrastruktur von PILAR SYSTEMS mehr Leads, Probetrainings und Abschlüsse erzielen.',
};

interface CaseStudyDetailsPageProps {
  params: { slug: string };
}

const CaseStudyDetailsPage = async ({ params }: CaseStudyDetailsPageProps) => {
  const { slug } = params;

  return (
    <>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />
      <main className="bg-background-3 dark:bg-background-7">
        <PageHero
          title="Erfolgsgeschichte"
          heading="Wie Studios mit PILAR SYSTEMS skalieren."
          link="/case-study"
          className="pt-24 md:pt-36 lg:pt-40 xl:pt-[200px]"
        />

        <CaseStudyDetails slug={slug} />

        <CTAV1
          className="dark:bg-background-5 bg-white"
          badgeClass="badge-yellow-v2"
          badgeText="Jetzt starten"
          ctaHeading="Bereit, ähnliche Ergebnisse in deinem Studio zu sehen?"
          description="Starte mit PILAR SYSTEMS und lass KI Telefon, WhatsApp, E-Mail und Follow-ups für dein Studio übernehmen – inklusive klaren Zahlen im Dashboard."
          ctaBtnText="Jetzt Pilar testen"
          btnClass="hover:btn-secondary dark:hover:btn-accent"
        />
      </main>
      <FooterOne />
    </>
  );
};

CaseStudyDetailsPage.displayName = 'CaseStudyDetailsPage';
export default CaseStudyDetailsPage;
