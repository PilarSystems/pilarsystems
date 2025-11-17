import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarOne from '@/components/shared/header/NavbarOne';
import PageHero from '@/components/shared/PageHero';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Impressum – PILAR SYSTEMS',
  description:
    'Impressum von PILAR SYSTEMS – Angaben gemäß § 5 TMG für den Betreiber dieser Website und des SaaS-Angebots für Fitnessstudios & Coaches.',
};

const ImprintPage = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />
      <main className="bg-background-3 dark:bg-background-7">
        <PageHero
          title="Impressum"
          heading="Angaben gemäß § 5 TMG."
          className="pt-24 md:pt-36 lg:pt-40 xl:pt-[200px]"
          link="/imprint"
        />

        <section className="py-16 md:py-20">
          <div className="main-container max-w-3xl space-y-10 text-secondary dark:text-accent">
            <div className="space-y-2">
              <h2 className="text-heading-5">Verantwortlich für den Inhalt</h2>
              <p className="text-tagline-1">
                <strong>PILAR SYSTEMS</strong>
                <br />
                Inhaber / Verantwortlicher: [Name eintragen]
                <br />
                [Straße und Hausnummer]
                <br />
                [PLZ] [Ort]
                <br />
                [Land]
              </p>
            </div>

            <div className="space-y-2 text-tagline-1">
              <h3 className="text-heading-6">Kontakt</h3>
              <p>
                Telefon: [Telefonnummer eintragen]
                <br />
                E-Mail: <a href="mailto:support@pilarsystems.com">support@pilarsystems.com</a>
              </p>
            </div>

            <div className="space-y-2 text-tagline-1">
              <h3 className="text-heading-6">Umsatzsteuer-ID</h3>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
                <br />
                [USt-IdNr. eintragen] (sofern vorhanden)
              </p>
            </div>

            <div className="space-y-2 text-tagline-1">
              <h3 className="text-heading-6">Berufsbezeichnung / Gewerbe</h3>
              <p>
                Tätigkeit: Betrieb einer Software-as-a-Service-Plattform (SaaS) für Fitnessstudios, Gyms, Studios und
                Coaches im Bereich Kommunikation, Terminmanagement und KI-gestützter Automatisierung.
              </p>
            </div>

            <div className="space-y-2 text-tagline-1">
              <h3 className="text-heading-6">Haftung für Inhalte</h3>
              <p>
                Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit
                und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß
                § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
              </p>
            </div>

            <div className="space-y-2 text-tagline-1">
              <h3 className="text-heading-6">Haftung für Links</h3>
              <p>
                Unser Angebot enthält ggf. Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss
                haben. Für diese fremden Inhalte übernehmen wir keine Gewähr. Für die Inhalte der verlinkten Seiten ist
                stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
            </div>

            <div className="space-y-2 text-[12px] text-secondary/60 dark:text-accent/60">
              <p>
                Hinweis: Diese Angaben dienen als Grundlage und ersetzen keine individuelle Rechtsberatung. Bitte
                überprüfe die Inhalte mit deinem Steuerberater oder Rechtsanwalt.
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterOne />
    </Fragment>
  );
};

export default ImprintPage;
