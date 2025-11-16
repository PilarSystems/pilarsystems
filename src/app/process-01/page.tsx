import ProcessFaq from '@/components/process-01/ProcessFaq';
import ProcessStep from '@/components/process-01/ProcessStep';
import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarOne from '@/components/shared/header/NavbarOne';
import PageHero from '@/components/shared/PageHero';
import { defaultMetadata } from '@/utils/generateMetaData';
import { Metadata } from 'next';
import { Fragment } from 'react';
import LinkButton from '@/components/ui/button/LinkButton';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Ablauf & Setup – Pilar Systems',
  description:
    'So startest du mit Pilar Systems: Plan wählen, Account erstellen, Setup-Wizard durchlaufen, Kanäle verbinden und deine KI-Rezeption in wenigen Tagen live schalten.',
};

const Process01 = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
        megaMenuColor="!bg-accent dark:!bg-background-9"
      />

      <main className="bg-background-2 dark:bg-background-5">
        <PageHero
          title="Ablauf"
          className="pt-24 md:pt-36 lg:pt-40 xl:pt-[200px]"
          heading="So wird aus Anfragen automatisch Umsatz – Schritt für Schritt."
          link="/process-01"
        />

        <ProcessStep />
        <ProcessFaq />

        {/* Eigene CTA-Sektion – führt direkt in den Signup-Flow */}
        <section className="bg-white dark:bg-background-6 py-16 md:py-20">
          <div className="main-container">
            <div className="text-center max-w-[720px] mx-auto space-y-4">
              <p className="badge badge-green mb-2">Jetzt starten</p>
              <h2 className="mb-3">In wenigen Minuten mit Pilar Systems loslegen.</h2>
              <p className="text-secondary/70 dark:text-accent/70">
                Wähle deinen Plan, erstelle deinen Account und führe den Setup-Wizard durch. Deine KI beginnt noch
                heute, Anfragen zu beantworten, Probetrainings zu buchen und Leads nachzufassen – während dein Team sich
                auf das Training konzentriert.
              </p>
              <div className="mt-6 flex justify-center">
                <LinkButton
                  href="/signup-01"
                  className="btn btn-primary btn-md hover:btn-secondary dark:hover:btn-accent w-[85%] md:w-auto"
                >
                  Jetzt Account erstellen
                </LinkButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterOne />
    </Fragment>
  );
};

Process01.displayName = 'Process01';
export default Process01;
