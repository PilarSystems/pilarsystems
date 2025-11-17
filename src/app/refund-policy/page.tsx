import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarOne from '@/components/shared/header/NavbarOne';
import PageHero from '@/components/shared/PageHero';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Widerruf & Rückerstattung – PILAR SYSTEMS',
  description:
    'Regelungen zu Widerruf, Rückerstattung und Kündigung für die Nutzung der PILAR SYSTEMS SaaS-Plattform.',
};

const RefundPolicyPage = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />
      <main className="bg-background-3 dark:bg-background-7">
        <PageHero
          title="Widerruf & Rückerstattung"
          heading="Regelungen für B2B-Kunden."
          className="pt-24 md:pt-36 lg:pt-40 xl:pt-[200px]"
          link="/refund-policy"
        />

        <section className="py-16 md:py-20">
          <div className="main-container max-w-3xl space-y-10 text-secondary dark:text-accent text-tagline-1">
            <div className="space-y-2">
              <h2 className="text-heading-5">1. Kein gesetzliches Widerrufsrecht für B2B</h2>
              <p>
                Unsere Leistungen richten sich ausschließlich an Unternehmer im Sinne von § 14 BGB. Ein gesetzliches
                Widerrufsrecht wie bei Verbraucherverträgen besteht daher in der Regel nicht.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">2. Testphasen & Demo-Zugänge</h2>
              <p>
                Sofern wir Testphasen, Probezugänge oder vergünstigte Startangebote zur Verfügung stellen, sind Umfang
                und Dauer jeweils im Angebot oder im Bestellprozess beschrieben. Nach Ablauf der Testphase geht der
                Zugang – sofern vereinbart – in ein reguläres Abonnement über.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">3. Kündigung von Abonnements</h2>
              <p>
                Abonnements können entsprechend der vereinbarten Kündigungsfrist zum Ende der jeweiligen Laufzeit
                beendet werden. Bereits abgerechnete Zeiträume werden nicht rückerstattet, sofern nicht gesetzlich
                zwingend etwas anderes vorgeschrieben ist oder ausdrücklich etwas anderes vereinbart wurde.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">4. Rückerstattungen im Einzelfall</h2>
              <p>
                In Ausnahmefällen können wir im Rahmen einer Kulanzregelung (z. B. bei technischen Problemen über einen
                längeren Zeitraum) anteilige Rückerstattungen oder Gutschriften anbieten. Dies erfolgt stets
                einzelfallbezogen und ohne Anerkennung einer Rechtspflicht.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">5. Kontakt für Rückfragen</h2>
              <p>
                Für Fragen zu Abrechnung, Kündigung oder möglichen Rückerstattungen wende dich bitte an:
                <br />
                E-Mail:{' '}
                <a href="mailto:support@pilarsystems.com">
                  support@pilarsystems.com
                </a>
                .
              </p>
            </div>

            <div className="space-y-2 text-[12px] text-secondary/60 dark:text-accent/60">
              <p>
                Hinweis: Diese Regelungen ersetzen keine individuelle Rechtsberatung. Prüfe bitte gemeinsam mit deinem
                Rechtsberater, ob sie zu deinem konkreten Geschäftsmodell und deiner Rechtsform passen.
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterOne />
    </Fragment>
  );
};

export default RefundPolicyPage;
