import RevealAnimation from '../animation/RevealAnimation';

const VisionStatement = () => {
  return (
    <section className="pb-14 md:pb-16 lg:pb-[88px] xl:pb-[100px] pt-[100px]">
      <div className="main-container space-y-12 md:space-y-16 lg:space-y-[100px]">
        {/* Headline / Copy */}
        <div className="space-y-3 text-center max-w-[780px] mx-auto">
          <RevealAnimation delay={0.2}>
            <span className="badge badge-cyan mb-5">Unsere Vision</span>
          </RevealAnimation>
          <RevealAnimation delay={0.3}>
            <h2 className="font-medium">
              Weniger Chaos im Studioalltag. Mehr Fokus auf Mitglieder und Wachstum.
            </h2>
          </RevealAnimation>
          <RevealAnimation delay={0.4}>
            <p>
              Pilar Systems ist aus einem einfachen Gedanken entstanden: Studios verlieren täglich Potenzial, weil
              Telefon, WhatsApp, E-Mail und Schichtpläne nicht zusammenarbeiten. Unsere Vision ist ein System, das
              Anfragen, Probetrainings, Check-ins und Trainingsorganisation so intelligent verbindet, dass dein Team
              wieder Zeit für das Wesentliche hat – Menschen.
            </p>
          </RevealAnimation>
        </div>

        {/* Code-based Visual statt PNG-Bilder */}
        <article className="grid gap-6 md:gap-8 md:grid-cols-[1.1fr_1fr]">
          {/* Linke Seite – „Studio Command Center“ */}
          <RevealAnimation delay={0.5} instant>
            <div className="relative rounded-[24px] bg-gradient-to-br from-accent/10 via-background-1 to-background-3 dark:from-accent/15 dark:via-background-7 dark:to-background-8 border border-stroke-2/70 dark:border-stroke-6/70 p-6 md:p-8 overflow-hidden">
              {/* weiche Glows */}
              <div className="pointer-events-none absolute -top-10 -right-16 h-40 w-40 rounded-full bg-accent/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-secondary/10 dark:bg-background-5/40 blur-3xl" />

              <div className="flex items-center justify-between mb-6">
                <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/70">
                  Studio Command Center
                </p>
                <div className="flex gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80" />
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-300/80" />
                </div>
              </div>

              {/* Inbox-Zeile */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between rounded-2xl bg-background-1/90 dark:bg-background-9/80 border border-stroke-2/70 dark:border-stroke-6/70 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-[11px] text-secondary/70 dark:text-accent">
                      KI
                    </span>
                    <div>
                      <p className="text-tagline-1 font-medium text-secondary dark:text-accent">
                        Live-Inbox deines Studios
                      </p>
                      <p className="text-[11px] text-secondary/60 dark:text-accent/60">
                        Telefon, WhatsApp, E-Mail &amp; Formulare in einem Stream.
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-400/10 text-[11px] px-3 py-1 text-emerald-500">
                    24 neue Leads
                  </span>
                </div>

                {/* kleine Timeline-Zeile */}
                <div className="rounded-2xl bg-background-1/60 dark:bg-background-9/60 border border-dashed border-stroke-2/60 dark:border-stroke-6/60 px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-secondary/70 dark:text-accent/70">
                    <span>Heute</span>
                    <span>Probetrainings &amp; Calls</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-1.5 rounded-full bg-emerald-400/30" />
                    <div className="flex-1 h-1.5 rounded-full bg-accent/30" />
                    <div className="flex-[0.6] h-1.5 rounded-full bg-amber-300/40" />
                  </div>
                  <div className="flex justify-between text-[11px] text-secondary/60 dark:text-accent/60">
                    <span>08:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                  </div>
                </div>
              </div>

              {/* KPI-Karten unten */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-background-1/90 dark:bg-background-9/80 border border-stroke-2/70 dark:border-stroke-6/70 px-4 py-3 space-y-1.5">
                  <p className="text-[11px] text-secondary/60 dark:text-accent/60">Erschienene Probetrainings</p>
                  <p className="text-heading-5">+34%</p>
                  <p className="text-[11px] text-emerald-400/80">vs. Vormonat</p>
                </div>
                <div className="rounded-2xl bg-background-1/90 dark:bg-background-9/80 border border-stroke-2/70 dark:border-stroke-6/70 px-4 py-3 space-y-1.5">
                  <p className="text-[11px] text-secondary/60 dark:text-accent/60">Antwortzeit</p>
                  <p className="text-heading-5">2 min</p>
                  <p className="text-[11px] text-secondary/60 dark:text-accent/60">Ø auf neue Anfrage</p>
                </div>
                <div className="rounded-2xl bg-background-1/90 dark:bg-background-9/80 border border-stroke-2/70 dark:border-stroke-6/70 px-4 py-3 space-y-1.5">
                  <p className="text-[11px] text-secondary/60 dark:text-accent/60">Automatisierte Kontakte / Monat</p>
                  <p className="text-heading-5">2.400+</p>
                  <p className="text-[11px] text-secondary/60 dark:text-accent/60">über alle Kanäle</p>
                </div>
              </div>
            </div>
          </RevealAnimation>

          {/* Rechte Seite – „Mitglieder-Fokus“ */}
          <RevealAnimation delay={0.6} instant>
            <div className="flex flex-col gap-4 md:gap-5">
              <div className="rounded-2xl bg-background-1/90 dark:bg-background-8/90 border border-stroke-2/70 dark:border-stroke-6/70 px-5 py-4 space-y-2">
                <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/70">
                  Fokus deines Teams
                </p>
                <p className="text-tagline-1 text-secondary/85 dark:text-accent/85">
                  Statt im Postfach zu hängen, kann dein Team auf der Fläche sein – mit klarer Planung, wer wann
                  Probetraining hat und welche Leads noch offen sind.
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-accent/15 via-background-1 to-background-3 dark:from-accent/20 dark:via-background-7 dark:to-background-8 border border-stroke-2/70 dark:border-stroke-6/70 px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">Heute im Überblick</p>
                  <span className="rounded-full bg-background-1/70 dark:bg-background-9/80 px-3 py-1 text-[11px] text-secondary/70 dark:text-accent/70">
                    Studio-Dashboard
                  </span>
                </div>
                <ul className="space-y-1.5 text-[12px] text-secondary/80 dark:text-accent/80">
                  <li className="flex justify-between">
                    <span>Neue Leads</span>
                    <span className="font-medium">18</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Gebuchte Probetrainings</span>
                    <span className="font-medium">11</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Offene Rückrufe</span>
                    <span className="font-medium">3</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Aktive Automationen</span>
                    <span className="font-medium">7</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-background-1/90 dark:bg-background-9/90 border border-dashed border-stroke-2/70 dark:border-stroke-6/70 px-5 py-4 space-y-2">
                <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/60">
                  Vision in einem Satz
                </p>
                <p className="text-tagline-1 text-secondary/80 dark:text-accent/80">
                  Ein Studioalltag, in dem kein Lead verloren geht, kein Mitglied vergessen wird und dein Team trotzdem
                  früher Feierabend machen kann.
                </p>
              </div>
            </div>
          </RevealAnimation>
        </article>
      </div>
    </section>
  );
};

export default VisionStatement;
