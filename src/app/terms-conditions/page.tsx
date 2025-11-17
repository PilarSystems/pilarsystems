import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarOne from '@/components/shared/header/NavbarOne';
import PageHero from '@/components/shared/PageHero';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Allgemeine Geschäftsbedingungen – PILAR SYSTEMS',
  description:
    'Allgemeine Geschäftsbedingungen (AGB) für die Nutzung der SaaS-Plattform PILAR SYSTEMS durch Fitnessstudios, Gyms und Coaches.',
};

const TermsConditionsPage = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />
      <main className="bg-background-3 dark:bg-background-7">
        <PageHero
          title="AGB"
          heading="Allgemeine Geschäftsbedingungen (B2B)."
          className="pt-24 md:pt-36 lg:pt-40 xl:pt-[200px]"
          link="/terms-conditions"
        />

        <section className="py-16 md:py-20">
          <div className="main-container max-w-3xl space-y-10 text-secondary dark:text-accent text-tagline-1">
            <div className="space-y-2">
              <h2 className="text-heading-5">1. Geltungsbereich</h2>
              <p>
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen PILAR SYSTEMS und
                gewerblichen Kunden (insbesondere Fitnessstudios, Gyms, Studios und Coaches) über die Nutzung der
                SaaS-Plattform von PILAR SYSTEMS. Verbraucher im Sinne von § 13 BGB sind nicht Zielgruppe dieses
                Angebots.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">2. Vertragsgegenstand</h2>
              <p>
                Vertragsgegenstand ist die zeitlich befristete Nutzung der webbasierten Plattform von PILAR SYSTEMS
                (z. B. KI-Inbox, Telefon-KI, Terminmanagement, Reporting) im Rahmen eines Abonnementmodells (Basic, Pro
                oder Elite). Die Plattform wird ausschließlich als Online-Dienst (Software-as-a-Service) bereitgestellt.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">3. Vertragsschluss</h2>
              <p>
                Der Vertrag kommt in der Regel über den Online-Bestellprozess auf dieser Website zustande. Mit Abschluss
                des Bestellvorgangs und Bestätigung durch PILAR SYSTEMS (z. B. per E-Mail oder durch Freischaltung des
                Zugangs) ist der Vertrag wirksam.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">4. Preise, Setup-Gebühr & Zahlung</h2>
              <p>
                Es gelten die jeweils aktuellen Preise gemäß der auf der Website dargestellten Pläne (Basic, Pro,
                Elite). Zusätzlich kann eine einmalige Setup-Gebühr anfallen. Die Abrechnung erfolgt in der Regel
                monatlich oder jährlich im Voraus, z. B. über einen Zahlungsdienstleister (z. B. Stripe). Alle Preise
                verstehen sich zzgl. der jeweils gültigen Umsatzsteuer, sofern nicht anders ausgewiesen.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">5. Laufzeit & Kündigung</h2>
              <p>
                Sofern nicht anders vereinbart, haben Abonnements eine Mindestlaufzeit von einem Monat und verlängern
                sich automatisch um die jeweils gewählte Laufzeit (monatlich / jährlich), wenn sie nicht innerhalb der
                vereinbarten Frist zum Laufzeitende gekündigt werden. Die Kündigung kann in Textform erfolgen (z. B. per
                E-Mail).
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">6. Verfügbarkeit & Wartung</h2>
              <p>
                PILAR SYSTEMS bemüht sich um eine hohe Verfügbarkeit der Plattform. Kurzfristige Unterbrechungen können
                im Rahmen von Wartungsarbeiten oder technischen Störungen auftreten. Geplante Wartungsfenster werden –
                soweit möglich – im Voraus angekündigt.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">7. Verantwortlichkeit & Inhalte des Kunden</h2>
              <p>
                Der Kunde ist für die Rechtmäßigkeit der von ihm eingestellten oder übermittelten Inhalte, Daten und
                Kommunikationsinhalte verantwortlich. Insbesondere ist sicherzustellen, dass keine Rechte Dritter
                verletzt werden und sämtliche datenschutzrechtlichen Vorgaben eingehalten werden.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">8. Haftung</h2>
              <p>
                Für leichte Fahrlässigkeit haftet PILAR SYSTEMS nur bei Verletzung wesentlicher Vertragspflichten
                (Kardinalpflichten) und beschränkt auf den vorhersehbaren, typischerweise eintretenden Schaden. Die
                Haftung für entgangenen Gewinn ist – soweit rechtlich zulässig – ausgeschlossen. Die Haftung für
                Vorsatz, grobe Fahrlässigkeit sowie für Schäden aus der Verletzung von Leben, Körper oder Gesundheit
                bleibt unberührt.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">9. Datenschutz</h2>
              <p>
                Für die Verarbeitung personenbezogener Daten im Rahmen der Nutzung der Plattform gelten die separaten
                Datenschutzhinweise von PILAR SYSTEMS. Diese sind unter <strong>/privacy</strong> abrufbar.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="text-heading-5">10. Schlussbestimmungen</h2>
              <p>
                Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Ausschließlicher
                Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesem Vertrag ist – soweit zulässig
                – der Sitz von PILAR SYSTEMS.
              </p>
            </div>

            <div className="space-y-2 text-[12px] text-secondary/60 dark:text-accent/60">
              <p>
                Hinweis: Diese AGB sind als Muster/Basis für B2B-SaaS gedacht und sollten vor finalem Einsatz von einem
                Rechtsanwalt geprüft und ggf. angepasst werden.
              </p>
            </div>
          </div>
        </section>
      </main>
      <FooterOne />
    </Fragment>
  );
};

export default TermsConditionsPage;
