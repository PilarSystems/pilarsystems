import RevealAnimation from '../animation/RevealAnimation';

const Client = () => {
  return (
    <section className="pt-10 md:pt-14 lg:pt-16 pb-10 md:pb-14 lg:pb-16 bg-background-1 dark:bg-background-6">
      <div className="main-container">
        <div className="w-full rounded-2xl bg-background-2 dark:bg-background-5 px-6 md:px-10 lg:px-14 py-8 md:py-10 lg:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <RevealAnimation delay={0.2}>
            <div className="max-w-[420px]">
              <p className="text-tagline-2 uppercase tracking-[0.12em] text-secondary/60 dark:text-accent/60 mb-2">
                Für Studios entwickelt
              </p>
              <h3 className="text-heading-5 md:text-heading-4">
                Weniger Telefonstress. Mehr Probetrainings. Klarere Prozesse.
              </h3>
            </div>
          </RevealAnimation>

          <RevealAnimation delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm md:text-base">
              <div>
                <p className="font-semibold text-secondary dark:text-accent">
                  +2.400&nbsp;automatisierte Kontakte / Monat
                </p>
                <p className="text-secondary/60 dark:text-accent/60 text-tagline-2">
                  über Telefon, WhatsApp, E-Mail & Website
                </p>
              </div>
              <div>
                <p className="font-semibold text-secondary dark:text-accent">
                  24/7 Erreichbarkeit
                </p>
                <p className="text-secondary/60 dark:text-accent/60 text-tagline-2">
                  ohne Zusatz-Schichten oder Callcenter
                </p>
              </div>
              <div>
                <p className="font-semibold text-secondary dark:text-accent">
                  100&nbsp;% DSGVO-konform
                </p>
                <p className="text-secondary/60 dark:text-accent/60 text-tagline-2">
                  Infrastruktur für Studios & Ketten
                </p>
              </div>
            </div>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default Client;
