import NumberAnimation from '../animation/NumberAnimation';
import RevealAnimation from '../animation/RevealAnimation';

const Counter = () => {
  return (
    <section className="pt-16 md:pt-20 lg:pt-[90px] xl:pt-[100px] pb-16 md:pb-20 lg:pb-[90px] xl:pb-[100px]">
      <div className="main-container">
        <div className="text-center space-y-3 mb-10 md:mb-[70px]">
          <RevealAnimation delay={0.2}>
            <h2>KPIs, die zeigen, was PILAR leisten kann.</h2>
          </RevealAnimation>
          <RevealAnimation delay={0.3}>
            <p className="max-w-[680px] mx-auto">
              Von der ersten Anfrage bis zum Vertragsabschluss: PILAR SYSTEMS automatisiert die komplette Kommunikation
              und schafft messbare Ergebnisse für Studios und Coaches.
            </p>
          </RevealAnimation>
        </div>

        <RevealAnimation delay={0.4}>
          <div className="flex flex-col max-md:gap-y-10 max-lg:gap-x-4 md:flex-row justify-between bg-secondary dark:bg-background-8 rounded-[20px] px-3 lg:px-[60px] py-14">
            <div className="space-y-2 text-center">
              <h3 className="text-white flex items-center justify-center">
                <NumberAnimation number={2400} speed={2000} interval={200} rooms={3} heightSpaceRatio={2} />+
              </h3>
              <p className="text-white/60">Automatisierte Anfragen pro Monat über Telefon, WhatsApp & E-Mail.*</p>
            </div>

            <div className="space-y-2 text-center">
              <h3 className="text-white flex items-center justify-center">
                <NumberAnimation number={87} speed={2000} interval={200} rooms={2} heightSpaceRatio={2} />%
              </h3>
              <p className="text-white/60">Steigerung der Lead-Conversion auf Probetrainings & Termine.*</p>
            </div>

            <div className="space-y-2 text-center">
              <h3 className="text-white flex items-center justify-center">
                <NumberAnimation number={300} speed={2000} interval={200} rooms={3} heightSpaceRatio={2} />+
              </h3>
              <p className="text-white/60">Stunden Mitarbeiteraufwand pro Monat eingespart durch Automatisierung.*</p>
            </div>

            <div className="space-y-2 text-center">
              <h3 className="text-white flex items-center justify-center">
                <NumberAnimation number={95} speed={2000} interval={200} rooms={2} heightSpaceRatio={2} />%
              </h3>
              <p className="text-white/60">Studios, die PILAR nach der Testphase aktiv weiter nutzen.*</p>
            </div>
          </div>
        </RevealAnimation>

        <RevealAnimation delay={0.5}>
          <p className="mt-4 text-center text-xs text-secondary/60 dark:text-accent/60 max-w-[680px] mx-auto">
            *Werte basieren auf ersten Pilotkunden und internen Szenario-Rechnungen. Konkrete Ergebnisse können je nach
            Standort, Angebot und Marketing-Aktivität variieren.
          </p>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default Counter;
