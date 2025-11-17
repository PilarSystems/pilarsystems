import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';

const integrationFeatures = [
  {
    id: 1,
    text: 'On-Demand Support für dein Team',
    delay: 0.6,
  },
  {
    id: 2,
    text: 'Transparente Daten & klare Einblicke',
    delay: 0.7,
  },
  {
    id: 3,
    text: 'Cloud-basierte KI-Infrastruktur',
    delay: 0.8,
  },
];

const Integration = () => {
  return (
    <section className="lg:pt-[100px] pt-[50px] md:pt-[75px] lg:pb-[100px] pb-[50px] md:pb-[75px] bg-white dark:bg-background-7">
      <div className="main-container">
        <div className="grid grid-cols-12 items-center xl:gap-[100px] lg:gap-20 gap-y-16">
          {/* Linke Seite – Visual, komplett ohne Bild-Assets, nur Code */}
          <div className="col-span-12 lg:col-span-6 lg:pt-[150px] pt-[100px]">
            <div className="relative z-10 inline-block max-lg:left-1/2 max-lg:-translate-x-1/2">
              {/* Hauptkarte */}
              <RevealAnimation delay={0.2} direction="left" offset={100}>
                <div className="max-w-[358px] rounded-[20px] bg-gradient-to-br from-accent/22 via-background-1 to-background-3 p-5 shadow-lg dark:from-accent/28 dark:via-background-8 dark:to-background-9">
                  <div className="mb-4 flex items-center justify-between text-[11px] text-secondary/70 dark:text-accent/70">
                    <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-secondary/80 dark:bg-background-9/80 dark:text-accent/80">
                      Live-Feedback
                    </span>
                    <span className="rounded-full bg-black/5 px-2.5 py-1 text-[10px] text-secondary/70 dark:bg-white/5 dark:text-accent/70">
                      Studio-Dashboard
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl bg-white/90 p-3 text-[11px] shadow-sm dark:bg-background-9/90">
                      <p className="text-secondary/80 dark:text-accent/80">
                        „Seit PILAR sind Anfragen, Probetrainings und Rückmeldungen endlich in einem System – nichts
                        geht mehr im Postfach unter.“
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div className="rounded-xl bg-white/80 p-2 dark:bg-background-9/80">
                        <p className="text-secondary/70 dark:text-accent/70">Antwortzeit</p>
                        <p className="mt-1 text-emerald-500/90">&lt; 1 Min</p>
                      </div>
                      <div className="rounded-xl bg-white/80 p-2 dark:bg-background-9/80">
                        <p className="text-secondary/70 dark:text-accent/70">Show-up-Rate</p>
                        <p className="mt-1 text-emerald-500/90">+60%</p>
                      </div>
                      <div className="rounded-xl bg-white/80 p-2 dark:bg-background-9/80">
                        <p className="text-secondary/70 dark:text-accent/70">No-Shows</p>
                        <p className="mt-1 text-emerald-500/90">-24%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealAnimation>

              {/* schwebende Karte oben rechts */}
              <RevealAnimation delay={0.3} direction="right">
                <div className="absolute max-sm:w-[200px] md:w-[250px] lg:w-[260px] xl:w-auto -top-12 -right-14 sm:-top-[90px] sm:-right-[200px] md:-right-[150px] lg:-right-[150px] xl:-right-[200px] rounded-2xl overflow-hidden">
                  <div className="rounded-2xl bg-gradient-to-br from-accent/20 via-background-1 to-background-3 p-4 shadow-md dark:from-accent/28 dark:via-background-8 dark:to-background-9">
                    <div className="flex items-center justify-between text-[10px] text-secondary/70 dark:text-accent/70 mb-2">
                      <span>Kanäle</span>
                      <span className="rounded-full bg-white/70 px-2 py-1 text-[9px] dark:bg-background-9/70">
                        synchronisiert
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px]">
                      {['Telefon', 'WhatsApp', 'E-Mail', 'DMs'].map((c) => (
                        <span
                          key={c}
                          className="rounded-full bg-white/80 px-3 py-1 text-secondary/80 dark:bg-background-9/80 dark:text-accent/80"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </RevealAnimation>

              {/* schwebender Chip unten rechts */}
              <RevealAnimation delay={0.4} direction="right">
                <div className="absolute max-sm:w-[130px] bottom-12 -right-14 sm:bottom-[85px] sm:-right-[200px] md:-right-[150px] lg:-right-[150px] xl:-right-[200px] -z-10 rounded-2xl overflow-hidden">
                  <div className="rounded-2xl bg-gradient-to-br from-secondary/15 via-background-2 to-background-3 px-4 py-3 text-[10px] text-secondary/80 shadow-md dark:from-accent/24 dark:via-background-7 dark:to-background-8 dark:text-accent/80">
                    <p>Feedback, KPIs & Reviews</p>
                    <p className="mt-1 text-secondary/60 dark:text-accent/60">
                      zentral in einer KI-Infrastruktur – statt in zehn verschiedenen Tools.
                    </p>
                  </div>
                </div>
              </RevealAnimation>
            </div>
          </div>

          {/* Rechte Seite – Copy & CTA */}
          <div className="col-span-12 lg:col-span-6">
            <div className="space-y-3 lg:text-left text-center">
              <RevealAnimation delay={0.3}>
                <span className="badge badge-cyan">Daten & Integrationen</span>
              </RevealAnimation>
              <RevealAnimation delay={0.4}>
                <h2 className="max-w-[592px] w-full lg:mx-0 mx-auto">
                  Wie PILAR Feedback, Kanäle und Zahlen in einem System zusammenbringt.
                </h2>
              </RevealAnimation>
              <RevealAnimation delay={0.5}>
                <p className="lg:max-w-[592px] max-w-[450px] w-full lg:mx-0 mx-auto">
                  Jede Anfrage, jedes Probetraining und jede Rückmeldung erzeugt Daten. PILAR verbindet diese Signale
                  aus Telefon, WhatsApp, E-Mail & DMs und macht daraus klare, nutzbare Insights – für bessere
                  Entscheidungen in deinem Studio.
                </p>
              </RevealAnimation>
            </div>
            <div className="pt-8 pb-14">
              <ul className="flex items-center lg:justify-start justify-center xl:gap-6 gap-4 flex-wrap">
                {integrationFeatures.map((feature) => (
                  <RevealAnimation key={feature.id} delay={feature.delay}>
                    <li className="flex items-center gap-2">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={15}
                          height={11}
                          viewBox="0 0 15 11"
                          fill="none"
                          className="shrink-0"
                        >
                          <path
                            d="M13.1875 1.79102L5.3125 9.66567L1.375 5.72852"
                            className="stroke-secondary dark:stroke-accent"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="lg:text-tagline-1 text-tagline-2 font-medium text-secondary dark:text-accent/60">
                        {feature.text}
                      </span>
                    </li>
                  </RevealAnimation>
                ))}
              </ul>
            </div>
            <RevealAnimation delay={0.8}>
              <div className="lg:text-left text-center">
                <LinkButton
                  href="/process-01"
                  className="btn btn-primary hover:btn-secondary btn-xl max-[376px]:w-full max-[426px]:w-[87%] md:w-auto dark:hover:btn-accent"
                >
                  Ablauf & Setup ansehen
                </LinkButton>
              </div>
            </RevealAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integration;
