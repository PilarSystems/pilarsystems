import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarOne from '@/components/shared/header/NavbarOne';
import PageHero from '@/components/shared/PageHero';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Datenschutz – PILAR SYSTEMS',
  description:
    'Informationen zum Datenschutz bei der Nutzung der Website und der SaaS-Plattform von PILAR SYSTEMS für Fitnessstudios & Coaches.',
};

const PrivacyPage = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />
      <main className="bg-background-3 dark:bg-background-7">
        <PageHero
          title="Datenschutz"
          heading="Datenschutzhinweise für Website & Plattform."
          className="pt-24 md:pt-36 lg:pt-40 xl:pt-[200px]"
          link="/privacy"
        />

        <section className="py-16 md:py-20">
          <div className="main-container max-w-3xl space-y-10 text-secondary dark:text-accent text-tagline-1">
            <div className="space-y-2">
              <h2 className="text-heading-5">1. Verantwortlicher</h2>
              <p>
                Verantwortlich für die Verarbeitung personenbezogener Daten im Zusammenhang mit dieser Website und der
                angebotenen Plattform ist:
                <br />
                <br />
                <strong>PILAR SYSTEMS</strong>
                <br />
                [Name / Inhaber eintragen]
                <br />
                [Adresse eintragen]
                <br />
                E-Mail: <a href="mailto:support@pilarsystems.com">support@pilarsystems.com</a>
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">2. Zwecke der Datenverarbeitung</h2>
              <p>
                Wir verarbeiten personenbezogene Daten, um:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>diese Website bereitzustellen und ihre Sicherheit zu gewährleisten,</li>
                <li>Anfragen über Kontaktformulare oder E-Mail zu beantworten,</li>
                <li>zugangsgeschützte Bereiche der Plattform (Dashboard, Konto) bereitzustellen,</li>
                <li>Vertragsbeziehungen mit Studios und Coaches zu erfüllen (z. B. Abrechnung, Support),</li>
                <li>Nutzungsdaten in anonymisierter Form zur Verbesserung unseres Angebots auszuwerten.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">3. Rechtsgrundlagen</h2>
              <p>
                Die Verarbeitung personenbezogener Daten erfolgt insbesondere auf Grundlage von:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung und vorvertragliche Maßnahmen),</li>
                <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an stabiler, sicherer Plattform),</li>
                <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung, z. B. bei optionalen Marketing-Mails).</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">4. Hosting & Auftragsverarbeitung</h2>
              <p>
                Wir hosten Teile unseres Angebots bei spezialisierten Dienstleistern (z. B. Cloud- und
                Infrastruktur-Anbieter). Mit diesen Dienstleistern bestehen Auftragsverarbeitungsverträge gemäß Art. 28
                DSGVO. Die Datenverarbeitung erfolgt ausschließlich nach unserer Weisung und auf sicheren Systemen.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">5. Speicherdauer</h2>
              <p>
                Personenbezogene Daten werden nur so lange gespeichert, wie es für die genannten Zwecke erforderlich ist
                oder gesetzliche Aufbewahrungspflichten bestehen. Danach werden die Daten gelöscht oder anonymisiert.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">6. Rechte betroffener Personen</h2>
              <p>Du hast im Rahmen der gesetzlichen Vorgaben folgende Rechte:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Recht auf Auskunft über die verarbeiteten Daten,</li>
                <li>Recht auf Berichtigung unrichtiger Daten,</li>
                <li>Recht auf Löschung („Recht auf Vergessenwerden“),</li>
                <li>Recht auf Einschränkung der Verarbeitung,</li>
                <li>Recht auf Datenübertragbarkeit,</li>
                <li>Recht auf Widerspruch gegen bestimmte Verarbeitungen.</li>
              </ul>
              <p className="mt-2">
                Wende dich dazu an{' '}
                <a href="mailto:support@pilarsystems.com">support@pilarsystems.com</a>.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">7. Cookies & Tracking</h2>
              <p>
                Sofern wir Cookies oder Analysetools einsetzen, informieren wir gesondert im Cookie-Hinweis bzw. in
                einem ergänzenden Abschnitt. Optional nicht technisch notwendige Cookies werden nur mit deiner
                Einwilligung gesetzt.
              </p>
            </div>

            <div className="space-y-2 text-[12px] text-secondary/60 dark:text-accent/60">
              <p>
                Hinweis: Diese Datenschutzhinweise sind eine vereinfachte Grundlage und sollten vor Livegang von einem
                Anwalt oder Datenschutzexperten geprüft und ggf. ergänzt werden (z. B. um konkrete eingesetzte
                Dienstleister, Tools und Drittstaatentransfers).
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterOne />
    </Fragment>
  );
};

export default PrivacyPage;
