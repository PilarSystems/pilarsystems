import RevealAnimation from '../animation/RevealAnimation';

const CaseStudy = () => {
  return (
    <section className="pt-7 pb-[20px] lg:pb-[100px]">
      <div className="main-container">
        <div className="space-y-[70px]">
          {/* Intro / Hero */}
          <div className="max-w-[900px] space-y-3">
            <RevealAnimation delay={0.2}>
              <h1 className="text-heading-3 md:text-heading-2 font-normal">
                Wie Studios mit PILAR SYSTEMS wachsen.
              </h1>
            </RevealAnimation>
            <RevealAnimation delay={0.3}>
              <p className="text-tagline-1 text-secondary/85 dark:text-accent/85">
                Von Boutique-Gyms bis hin zu Studios mit mehreren Standorten: PILAR SYSTEMS hilft Teams dabei, Anfragen
                zu bündeln, Probetrainings zu füllen und klare Zahlen über ihre Prozesse zu bekommen – ohne mehr
                Personal an der Rezeption.
              </p>
            </RevealAnimation>
          </div>

          {/* Featured Case – Code-Visual statt Bild */}
          <div className="space-y-6">
            <RevealAnimation delay={0.4}>
              <h2 className="text-heading-4">Beispiel-Case: Urban Strength Gym</h2>
            </RevealAnimation>

            {/* Meta-Infos */}
            <div className="grid gap-4 md:grid-cols-3 max-w-[700px]">
              <RevealAnimation delay={0.5}>
                <div className="rounded-2xl bg-background-1 dark:bg-background-7 border border-stroke-2/70 dark:border-stroke-6/70 px-4 py-3 space-y-1">
                  <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">Studio-Typ</p>
                  <p className="text-tagline-1 text-secondary dark:text-accent">
                    Boutique-Gym in einer Großstadt
                  </p>
                </div>
              </RevealAnimation>
              <RevealAnimation delay={0.55}>
                <div className="rounded-2xl bg-background-1 dark:bg-background-7 border border-stroke-2/70 dark:border-stroke-6/70 px-4 py-3 space-y-1">
                  <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">Ziel</p>
                  <p className="text-tagline-1 text-secondary dark:text-accent">
                    Mehr erschienene Probetrainings &amp; weniger No-Shows
                  </p>
                </div>
              </RevealAnimation>
              <RevealAnimation delay={0.6}>
                <div className="rounded-2xl bg-background-1 dark:bg-background-7 border border-stroke-2/70 dark:border-stroke-6/70 px-4 py-3 space-y-1">
                  <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">Genutzte Module</p>
                  <p className="text-tagline-1 text-secondary dark:text-accent">
                    KI-Inbox, Telefon-KI, Follow-ups, Kalender, Reporting
                  </p>
                </div>
              </RevealAnimation>
            </div>

            {/* Code-Visual: Before/After Panel */}
            <RevealAnimation delay={0.7}>
              <div className="relative rounded-[24px] overflow-hidden bg-gradient-to-br from-accent/14 via-background-1 to-background-3 dark:from-accent/22 dark:via-background-8 dark:to-background-9 border border-stroke-2/70 dark:border-stroke-6/70 px-6 md:px-8 py-7 md:py-8">
                {/* Glows */}
                <div className="pointer-events-none absolute -top-16 -left-10 h-48 w-48 rounded-full bg-accent/22 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-secondary/18 dark:bg-background-5/60 blur-3xl" />

                <div className="relative grid gap-6 md:grid-cols-[1.1fr_1fr] items-stretch">
                  {/* Challenge / Lösung */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/70">
                        Ausgangssituation
                      </p>
                      <p className="text-tagline-1 text-secondary/85 dark:text-accent/85 max-w-[540px]">
                        Das Team war tagsüber stark ausgelastet, verpasste Anrufe und WhatsApps häuften sich. Neue
                        Leads wurden zwar eingesammelt, aber kaum systematisch nachverfolgt. Viele Probetrainings
                        erschienen nicht – echte Kapazitäten blieben ungenutzt.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/70">
                        Umsetzung mit PILAR
                      </p>
                      <ul className="space-y-2 text-tagline-1 text-secondary/85 dark:text-accent/85">
                        <li className="before:content-[''] before:inline-block before:mr-2 before:mt-[2px] before:size-1.5 before:rounded-full before:bg-secondary/70 dark:before:bg-accent/80 align-top">
                          Alle Anfragen (Telefon, WhatsApp, E-Mail, Formulare) laufen in eine KI-Inbox mit klaren
                          Status-Pipelines.
                        </li>
                        <li className="before:content-[''] before:inline-block before:mr-2 before:mt-[2px] before:size-1.5 before:rounded-full before:bg-secondary/70 dark:before:bg-accent/80 align-top">
                          Telefon-KI nimmt Anrufe an, qualifiziert Interessenten und bucht Probetrainings direkt in den
                          Kalender.
                        </li>
                        <li className="before:content-[''] before:inline-block before:mr-2 before:mt-[2px] before:size-1.5 before:rounded-full before:bg-secondary/70 dark:before:bg-accent/80 align-top">
                          Automatische Follow-ups erinnern an Termine und holen verschobene Probetrainings zurück in den
                          Funnel.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Metrics Panel */}
                  <div className="space-y-4 rounded-3xl bg-background-1/90 dark:bg-background-9/90 border border-stroke-2/70 dark:border-stroke-6/70 px-5 py-5 md:px-6 md:py-6">
                    <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/70 mb-1">
                      Ergebnisse nach 12 Wochen
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-tagline-1 text-secondary/85 dark:text-accent/85">
                        <span>Erschienene Probetrainings</span>
                        <span className="font-medium text-emerald-400">+41%</span>
                      </div>
                      <div className="flex items-center justify-between text-tagline-1 text-secondary/85 dark:text-accent/85">
                        <span>Abschlüsse aus Leads</span>
                        <span className="font-medium text-emerald-400">+29%</span>
                      </div>
                      <div className="flex items-center justify-between text-tagline-1 text-secondary/85 dark:text-accent/85">
                        <span>No-Show-Rate</span>
                        <span className="font-medium text-rose-300">−36%</span>
                      </div>
                      <div className="flex items-center justify-between text-tagline-1 text-secondary/85 dark:text-accent/85">
                        <span>Zeit an der Rezeption</span>
                        <span className="font-medium text-emerald-400">−25%</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-dashed border-stroke-2/70 dark:border-stroke-6/70 space-y-1.5">
                      <p className="text-tagline-2 text-secondary/60 dark:text-accent/65">
                        Fazit des Studios
                      </p>
                      <p className="text-tagline-1 text-secondary/85 dark:text-accent/85">
                        „Es fühlt sich so an, als hätten wir eine zusätzliche Vollzeitkraft an der Rezeption – nur eben
                        ohne Schichtplan.“
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </RevealAnimation>
          </div>

          {/* Challenge / Lösung / Ergebnisse – Text-Block darunter (leicht angepasst) */}
          <div className="space-y-1">
            <RevealAnimation delay={0.1}>
              <h3 className="text-heading-4">Worauf wir bei Implementierungen achten</h3>
            </RevealAnimation>
            <RevealAnimation delay={0.2}>
              <p className="max-w-[705px] text-tagline-1 text-secondary/85 dark:text-accent/85">
                Jede Implementierung startet bei den Prozessen im Studio – nicht bei den Features. Wir analysieren,
                wo Anfragen reinkommen, wie Termine vergeben werden und wo Leads verloren gehen. Erst dann wird die
                KI so eingestellt, dass sie deinen Alltag wirklich abbildet.
              </p>
            </RevealAnimation>
          </div>

          <div className="flex items-center flex-col md:flex-row gap-16 justify-between">
            <div className="space-y-6 max-w-[420px]">
              <div>
                <RevealAnimation delay={0.3}>
                  <h4 className="text-heading-4">So sieht eine typische Lösung aus</h4>
                </RevealAnimation>
                <RevealAnimation delay={0.4}>
                  <p className="text-tagline-1 text-secondary/85 dark:text-accent/85">
                    Statt Insellösungen (Telefon, WhatsApp, E-Mail, Excel) entsteht ein durchgängiger Funnel:
                  </p>
                </RevealAnimation>
              </div>
              <ul className="space-y-2 text-tagline-1 text-secondary/85 dark:text-accent/85">
                <RevealAnimation delay={0.3}>
                  <li>
                    <p className="before:content-[''] before:size-2 before:bg-secondary dark:before:bg-accent before:rounded-full before:inline-block before:mr-3">
                      KI-Inbox mit klaren Status (neu, probetraining gebucht, abgeschlossen, verloren)
                    </p>
                  </li>
                </RevealAnimation>
                <RevealAnimation delay={0.4}>
                  <li>
                    <p className="before:content-[''] before:size-2 before:bg-secondary dark:before:bg-accent before:rounded-full before:inline-block before:mr-3">
                      Automatische Follow-ups &amp; Erinnerungen ohne manuelle To-dos
                    </p>
                  </li>
                </RevealAnimation>
                <RevealAnimation delay={0.5}>
                  <li>
                    <p className="before:content-[''] before:size-2 before:bg-secondary dark:before:bg-accent before:rounded-full before:inline-block before:mr-3">
                      Reporting zu Leads, Show-ups und Abschlüssen – nach Kanal und Kampagne
                    </p>
                  </li>
                </RevealAnimation>
              </ul>
            </div>

            <div className="space-y-6 max-w-[420px]">
              <div>
                <RevealAnimation delay={0.3}>
                  <h4 className="text-heading-4">Typische Ergebnisse</h4>
                </RevealAnimation>
                <RevealAnimation delay={0.4}>
                  <p className="text-tagline-1 text-secondary/85 dark:text-accent/85">
                    Die genauen Zahlen unterscheiden sich je nach Studio, aber die Muster sind ähnlich:
                  </p>
                </RevealAnimation>
              </div>
              <ul className="space-y-2 text-tagline-1 text-secondary/85 dark:text-accent/85">
                <RevealAnimation delay={0.3}>
                  <li>
                    <p className="before:content-[''] before:size-2 before:bg-secondary dark:before:bg-accent before:rounded-full before:inline-block before:mr-3">
                      Mehr erschienene Probetrainings, weil niemand mehr „vergessen“ wird
                    </p>
                  </li>
                </RevealAnimation>
                <RevealAnimation delay={0.4}>
                  <li>
                    <p className="before:content-[''] before:size-2 before:bg-secondary dark:before:bg-accent before:rounded-full before:inline-block before:mr-3">
                      Klarere Zahlen – welches Marketing lohnt sich wirklich?
                    </p>
                  </li>
                </RevealAnimation>
                <RevealAnimation delay={0.5}>
                  <li>
                    <p className="before:content-[''] before:size-2 before:bg-secondary dark:before:bg-accent before:rounded-full before:inline-block before:mr-3">
                      Spürbar weniger Stress an der Rezeption und im Backoffice
                    </p>
                  </li>
                </RevealAnimation>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudy;
