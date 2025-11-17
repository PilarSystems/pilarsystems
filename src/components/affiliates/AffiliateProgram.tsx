// affiliate-program section
import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';

const AffiliateProgram = () => {
  return (
    <section className="pt-7 pb-14 md:pb-16 lg:pb-[88px] xl:pb-[100px]">
      <div className="main-container">
        <div className="space-y-14 md:space-y-[70px]">
          {/* Headline / Copy */}
          <RevealAnimation delay={0.1}>
            <div className="md:text-center max-w-[640px] space-y-2.5 md:space-y-3 mx-auto">
              <span className="badge badge-cyan">PILAR Affiliate Programm</span>
              <h2>Verdiene mit jedem Studio, das du auf Pilar bringst.</h2>
              <h3 className="text-heading-4">
                Baue dir ein wiederkehrendes Einkommen mit Studios &amp; Coaches auf.
              </h3>
              <p>
                Empfiehl Pilar Systems an Fitnessstudios, Gyms oder Coaches und profitiere von attraktiven
                Provisionen auf abgeschlossene Pläne. Du brauchst kein eigenes Studio – nur Zugang zu Menschen mit
                Trainingsbusiness.
              </p>
              <div className="mt-7 md:mt-10">
                <LinkButton
                  href="/affiliate-policy"
                  className="btn btn-primary btn-xl hover:btn-secondary dark:hover:btn-accent w-full md:w-auto block md:inline-block"
                >
                  Jetzt als Affiliate bewerben
                </LinkButton>
              </div>
            </div>
          </RevealAnimation>

          {/* Code-based Visual: „Affiliate Dashboard“ statt Bild */}
          <RevealAnimation delay={0.2} instant>
            <div className="max-w-[920px] mx-auto">
              <div className="relative rounded-[24px] bg-gradient-to-br from-accent/14 via-background-1 to-background-3 dark:from-accent/22 dark:via-background-8 dark:to-background-9 border border-stroke-2/70 dark:border-stroke-6/70 px-6 md:px-9 py-7 md:py-8 overflow-hidden shadow-2">
                {/* Glows */}
                <div className="pointer-events-none absolute -top-16 -left-10 h-48 w-48 rounded-full bg-accent/25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -right-6 h-48 w-48 rounded-full bg-secondary/18 dark:bg-background-5/50 blur-3xl" />

                {/* Header */}
                <div className="relative mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/70">
                      Affiliate Dashboard
                    </p>
                    <p className="text-tagline-1 text-secondary/85 dark:text-accent/85">
                      Überblick über deine empfohlenen Studios &amp; Auszahlungen.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400/90 animate-pulse" />
                    <span className="rounded-full bg-background-1/80 dark:bg-background-9/80 px-3 py-1 text-secondary/70 dark:text-accent/80">
                      Einnahmen laufen
                    </span>
                  </div>
                </div>

                {/* Grid: Earnings + Studios + Status */}
                <div className="relative grid gap-4 md:grid-cols-[1.1fr_1fr]">
                  {/* Earnings Card */}
                  <div className="rounded-2xl bg-background-1/95 dark:bg-background-9/95 border border-stroke-2/70 dark:border-stroke-6/70 px-4 py-4 md:px-5 md:py-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-tagline-2 text-secondary/65 dark:text-accent/70">Geschätzte Monatsauszahlung</p>
                      <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] text-emerald-400">
                        wiederkehrend
                      </span>
                    </div>
                    <p className="text-heading-3 md:text-heading-2">
                      1.280<span className="text-heading-5 align-top ml-1">€</span>
                    </p>
                    <p className="text-[11px] text-secondary/60 dark:text-accent/60">
                      Beispielansicht: auf Basis mehrerer aktiver Studios mit Basic- und Pro-Plänen. Konkrete Konditionen
                      erhältst du nach erfolgreicher Bewerbung.
                    </p>

                    {/* Mini „Umsatzverlauf“ */}
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-secondary/60 dark:text-accent/60">
                        <span>Letzte 6 Monate</span>
                        <span>+42% Wachstum</span>
                      </div>
                      <div className="flex items-end gap-1.5 h-[46px]">
                        <div className="flex-1 rounded-full bg-accent/18 dark:bg-accent/15 h-[40%]" />
                        <div className="flex-1 rounded-full bg-accent/22 dark:bg-accent/18 h-[55%]" />
                        <div className="flex-1 rounded-full bg-accent/26 dark:bg-accent/20 h-[70%]" />
                        <div className="flex-1 rounded-full bg-accent/30 dark:bg-accent/24 h-[85%]" />
                        <div className="flex-1 rounded-full bg-accent/36 dark:bg-accent/30 h-[95%]" />
                        <div className="flex-1 rounded-full bg-accent/28 dark:bg-accent/22 h-[80%]" />
                      </div>
                    </div>
                  </div>

                  {/* Right column: Studios & Conversion */}
                  <div className="space-y-3.5">
                    <div className="rounded-2xl bg-background-1/95 dark:bg-background-9/95 border border-stroke-2/70 dark:border-stroke-6/70 px-4 py-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] text-secondary/60 dark:text-accent/60">Aktive Studios</p>
                        <span className="text-[11px] text-secondary/60 dark:text-accent/60">Deine Empfehlungen</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-heading-5">12</p>
                          <p className="text-[11px] text-secondary/60 dark:text-accent/60">bezahlt &amp; live</p>
                        </div>
                        <div className="text-right">
                          <p className="text-heading-6">68%</p>
                          <p className="text-[11px] text-secondary/60 dark:text-accent/60">
                            Conversion von Test zu Kunde
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-background-2 dark:bg-background-8">
                        <div className="h-full w-[68%] rounded-full bg-accent/80" />
                      </div>
                    </div>

                    <div className="rounded-2xl bg-background-1/95 dark:bg-background-9/95 border border-dashed border-stroke-2/70 dark:border-stroke-6/70 px-4 py-4 space-y-2">
                      <p className="text-[11px] text-secondary/60 dark:text-accent/60">Für wen sich das lohnt</p>
                      <ul className="space-y-1.5 text-[11px] text-secondary/80 dark:text-accent/80">
                        <li>Creator mit Fitness-Community oder Business-Zielgruppe</li>
                        <li>Agenturen &amp; Berater, die mit Studios arbeiten</li>
                        <li>Affiliate-Marketer, die Performance-orientiert arbeiten wollen</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bottom Hint */}
                <div className="relative mt-6 flex flex-wrap items-center gap-2 text-[11px] text-secondary/70 dark:text-accent/75">
                  <span className="rounded-full bg-background-1/80 dark:bg-background-9/80 px-3 py-1">
                    Tracking-Link &amp; Dashboard inklusive
                  </span>
                  <span className="rounded-full bg-background-1/60 dark:bg-background-8/80 px-3 py-1">
                    Keine Agenturpflicht – du kannst sofort loslegen
                  </span>
                </div>
              </div>
            </div>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

AffiliateProgram.displayName = 'AffiliateProgram';
export default AffiliateProgram;
