import NumberAnimation from '../animation/NumberAnimation';
import RevealAnimation from '../animation/RevealAnimation';
import Progress from '../homepage-04/Progress';

const OurMission = () => {
  return (
    <section className="pt-14 md:pt-16 lg:pt-[88px] xl:pt-[100px] pb-14 md:pb-16 lg:pb-[88px] xl:pb-[100px] overflow-hidden">
      <div className="main-container">
        <div className="grid grid-cols-12 lg:gap-x-0 xl:gap-x-28 gap-y-12 items-center">
          {/* Text-Spalte */}
          <div className="col-span-12 lg:col-span-6">
            <div className="space-y-3">
              <RevealAnimation delay={0.2}>
                <span className="badge badge-cyan mb-5">Unsere Mission</span>
              </RevealAnimation>
              <RevealAnimation delay={0.3}>
                <h2>Wir machen aus jedem Gym eine skalierbare Vertriebs- und Service-Maschine.</h2>
              </RevealAnimation>
              <RevealAnimation delay={0.4}>
                <p>
                  Unsere Mission ist es, Fitnessstudios von manuellen Abläufen zu befreien. Statt Zettelwirtschaft,
                  überfüllten Postfächern und verpassten Anrufen sorgt Pilar Systems dafür, dass Leads automatisch
                  erfasst, qualifiziert, nachverfolgt und in Verträge verwandelt werden – alles in einem System.
                </p>
              </RevealAnimation>
              <RevealAnimation delay={0.5}>
                <p>
                  Dabei geht es nicht nur um KI, sondern um Klarheit: Was passiert mit jeder Anfrage? Wer kommt wirklich
                  zum Probetraining? Welche Kampagne bringt Verträge? Pilar macht diese Fragen messbar – und damit
                  steuerbar.
                </p>
              </RevealAnimation>
            </div>
          </div>

          {/* Code-basiertes Visual statt Bild */}
          <div className="col-span-12 lg:col-span-6">
            <RevealAnimation delay={0.4}>
              <div className="relative w-full max-w-[520px] mx-auto">
                {/* weiche Glows */}
                <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 -left-6 h-40 w-40 rounded-full bg-secondary/15 dark:bg-background-5/50 blur-3xl" />

                {/* Hauptkarte */}
                <div className="relative rounded-[24px] bg-gradient-to-br from-accent/12 via-background-1 to-background-3 dark:from-accent/18 dark:via-background-7 dark:to-background-8 border border-stroke-2/70 dark:border-stroke-6/70 px-6 py-6 md:px-7 md:py-7 space-y-6 shadow-2">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/70">
                        Studio-Leitstand
                      </p>
                      <p className="text-tagline-1 text-secondary/85 dark:text-accent/85">
                        Was {`heute`} mit deinen Leads passiert.
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/90 animate-pulse" />
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80" />
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-300/80" />
                    </div>
                  </div>

                  {/* KPI Reihe */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-background-1/90 dark:bg-background-9/80 border border-stroke-2/70 dark:border-stroke-6/70 px-4 py-3 space-y-1.5">
                      <p className="text-[11px] text-secondary/60 dark:text-accent/60">Neue Leads heute</p>
                      <p className="text-heading-5 flex items-baseline gap-1">
                        +
                        <NumberAnimation
                          number={32}
                          speed={800}
                          interval={120}
                          rooms={2}
                          heightSpaceRatio={2.4}
                          className="text-heading-5"
                        />
                      </p>
                      <p className="text-[11px] text-secondary/60 dark:text-accent/60">über alle Kanäle</p>
                    </div>
                    <div className="rounded-2xl bg-background-1/90 dark:bg-background-9/80 border border-stroke-2/70 dark:border-stroke-6/70 px-4 py-3 space-y-1.5">
                      <p className="text-[11px] text-secondary/60 dark:text-accent/60">Erschienene Probetrainings</p>
                      <p className="text-heading-5">+34%</p>
                      <p className="text-[11px] text-emerald-400/80">vs. Vormonat</p>
                    </div>
                    <div className="rounded-2xl bg-background-1/90 dark:bg-background-9/80 border border-stroke-2/70 dark:border-stroke-6/70 px-4 py-3 space-y-1.5">
                      <p className="text-[11px] text-secondary/60 dark:text-accent/60">Antwortzeit</p>
                      <p className="text-heading-5">2 Min.</p>
                      <p className="text-[11px] text-secondary/60 dark:text-accent/60">Ø pro Anfrage</p>
                    </div>
                  </div>

                  {/* Inbox + Progress */}
                  <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-4 items-stretch">
                    <div className="rounded-2xl bg-background-1/95 dark:bg-background-9/90 border border-stroke-2/70 dark:border-stroke-6/70 px-4 py-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-tagline-2 text-secondary/70 dark:text-accent/75">
                          KI-Inbox – jetzt aktiv
                        </p>
                        <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[11px] text-emerald-400">
                          24/7 online
                        </span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-secondary/75 dark:text-accent/75">
                        <li className="flex justify-between">
                          <span>Telefon &amp; verpasste Anrufe</span>
                          <span className="font-medium">✓ übernommen</span>
                        </li>
                        <li className="flex justify-between">
                          <span>WhatsApp &amp; DMs</span>
                          <span className="font-medium">✓ beantwortet</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Probetrainings &amp; Rückrufe</span>
                          <span className="font-medium">laufen im Funnel</span>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-2xl bg-background-1/95 dark:bg-background-9/90 border border-stroke-2/70 dark:border-stroke-6/70 px-4 py-3 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <p className="text-[11px] text-secondary/60 dark:text-accent/60">
                          Automatisierte Anfragen / Monat
                        </p>
                        <p className="text-lg font-medium leading-[1.5] text-secondary dark:text-accent flex items-center gap-1">
                          +
                          <NumberAnimation
                            number={2400}
                            speed={1000}
                            interval={180}
                            rooms={4}
                            heightSpaceRatio={2.5}
                            className="text-lg font-medium leading-[1.5] text-secondary dark:text-accent"
                          />
                        </p>
                      </div>
                      <div className="mt-3">
                        <Progress />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMission;
