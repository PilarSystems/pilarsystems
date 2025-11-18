import Link from 'next/link';
import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';
import StackCardItem from '../ui/stack-card/StackCardItem';
import StackCardWrapper from '../ui/stack-card/StackCardWrapper';

const gradientTopClass =
  'pointer-events-none absolute left-0 top-0 h-[10px] w-2/3 rounded-t-[20px] bg-gradient-to-r from-[#38bdf8] via-[#6366f1] to-[#a855f7] opacity-90';
const gradientLeftClass =
  'pointer-events-none absolute left-0 top-0 w-[10px] h-2/3 rounded-l-[20px] bg-gradient-to-b from-[#38bdf8] via-[#6366f1] to-[#a855f7] opacity-90';

const Integration = () => {
  return (
    <section className="pt-16 md:pt-20 lg:pt-[90px] xl:pt-[150px] pb-16 md:pb-20 lg:pb-[90px] xl:pb-[250px]">
      <div className="bg-background-2 dark:bg-background-5">
        <div className="main-container">
          <div className="flex flex-col lg:flex-row items-start gap-y-24 gap-x-[140px]">
            {/* Left: Headline / Copy */}
            <div className="w-full lg:flex-1 lg:sticky lg:top-28 lg:max-w-full max-w-[520px] lg:mx-0 mx-auto text-center lg:text-left">
              <RevealAnimation delay={0.2}>
                <span className="badge badge-green mb-5">Ablauf</span>
              </RevealAnimation>
              <RevealAnimation delay={0.3}>
                <h2 className="mb-3 max-w-[529px]">
                  So wird aus Anfragen automatisch Umsatz.
                </h2>
              </RevealAnimation>
              <RevealAnimation delay={0.4}>
                <p className="mb-7 lg:max-w-[620px]">
                  Von der Online-Buchung über das Setup bis zur laufenden Automatisierung – PILAR SYSTEMS fügt sich in
                  deinen Alltag ein, ohne dein Team zu überfordern.
                </p>
              </RevealAnimation>
              <RevealAnimation delay={0.5}>
                <div>
                  <LinkButton
                    href="/process-01"
                    rel="noopener noreferrer"
                    className="btn btn-secondary hover:btn-primary dark:btn-transparent btn-md w-[85%] md:w-auto mx-auto"
                  >
                    Ablauf im Detail ansehen
                  </LinkButton>
                </div>
              </RevealAnimation>
            </div>

            {/* Right: Sticky StackCards */}
            <StackCardWrapper
              topOffset="15vh"
              gap="24px"
              initDelay={100}
              className="w-full lg:flex-1 lg:max-w-full md:max-w-[50%] sm:max-w-[60%] lg:mx-0 mx-auto max-w-full"
            >
              {/* Step 1 – Online starten */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="relative rounded-[20px]">
                    {/* Gradient-Stroke nur oben/links */}
                    <div className={gradientTopClass} />
                    <div className={gradientLeftClass} />

                    <figure className="relative z-[1] p-8 rounded-[20px] bg-white dark:bg-background-5 space-y-6">
                      <figcaption className="space-y-2">
                        <h5>Online starten und Setup-Wizard durchlaufen.</h5>
                        <p className="max-w-[260px] text-secondary/60 dark:text-accent/70">
                          Dein Studio wählt einen Plan, erstellt einen Account und führt den geführten Setup-Wizard
                          durch – ganz ohne Telefontermin oder Vor-Ort-Besuch.
                        </p>
                      </figcaption>

                      {/* Inneres Visual – weißer Hintergrund, grauer Text, fette Zahlen */}
                      <div className="max-w-[385px] w-full">
                        <div className="rounded-2xl bg-gradient-to-r from-[#38bdf8] via-[#6366f1] to-[#a855f7] p-[1px]">
                          <div className="rounded-[15px] bg-white dark:bg-background-4 h-[220px] md:h-[260px] p-5 flex flex-col justify-between">
                            {/* Top: URL + Status */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2 text-[11px] text-secondary/60 dark:text-accent/70">
                                <span className="size-2 rounded-full bg-accent" />
                                <span>studio.pilar.app</span>
                              </div>
                              <span className="rounded-full bg-background-1 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-secondary/70 dark:bg-background-6 dark:text-accent/70">
                                Setup-Wizard
                              </span>
                            </div>

                            {/* Steps */}
                            <div className="space-y-2 text-[11px]">
                              {['Account erstellen', 'Standort & Öffnungszeiten', 'Tarife & Angebote'].map(
                                (label, idx) => (
                                  <div
                                    key={label}
                                    className="flex items-center justify-between rounded-xl bg-background-1 dark:bg-background-6 px-3 py-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="size-4 rounded-full border border-secondary/20 dark:border-accent/25 flex items-center justify-center text-[9px] text-secondary/70 dark:text-accent/70">
                                        {idx + 1}
                                      </span>
                                      <span className="text-secondary/70 dark:text-accent/80">{label}</span>
                                    </div>
                                    <span className="text-[10px] text-secondary/50 dark:text-accent/60">
                                      {idx === 0 ? 'fertig' : idx === 1 ? 'läuft' : 'als nächstes'}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>

                            {/* Progress */}
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-[10px] mb-1 text-secondary/60 dark:text-accent/70">
                                <span>Fortschritt</span>
                                <span className="font-semibold text-secondary dark:text-accent">62%</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-background-1 dark:bg-background-6 overflow-hidden">
                                <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[#38bdf8] via-[#6366f1] to-[#a855f7]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </figure>
                  </div>
                </div>
              </StackCardItem>

              {/* Step 2 – Systeme verbinden */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="relative rounded-[20px]">
                    <div className={gradientTopClass} />
                    <div className={gradientLeftClass} />

                    <figure className="relative z-[1] p-8 rounded-[20px] bg-white dark:bg-background-5 space-y-6">
                      <figcaption className="space-y-2">
                        <h5>Systeme verbinden und alles testen.</h5>
                        <p className="max-w-[260px] text-secondary/60 dark:text-accent/70">
                          Telefonanlage, WhatsApp, E-Mail-Postfach und Kalender werden angebunden – danach testest du
                          gemeinsam mit uns typische Szenarien aus Sicht deiner Mitglieder.
                        </p>
                      </figcaption>

                      {/* Inneres Visual */}
                      <div className="rounded-2xl overflow-hidden max-w-[400px] w-full">
                        <div className="rounded-2xl bg-gradient-to-r from-[#38bdf8] via-[#6366f1] to-[#a855f7] p-[1px]">
                          <div className="h-[220px] md:h-[260px] rounded-[15px] bg-white dark:bg-background-4 p-5 flex flex-col justify-between">
                            {/* Icons row */}
                            <div className="flex items-center justify-between text-[11px] text-secondary/70 dark:text-accent/80 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="size-6 rounded-full bg-background-1 dark:bg-background-6 flex items-center justify-center">
                                  📞
                                </span>
                                <span>Telefonanlage</span>
                              </div>
                              <span className="text-[10px] font-semibold text-secondary dark:text-accent">
                                Verbunden
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-secondary/70 dark:text-accent/80 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="size-6 rounded-full bg-background-1 dark:bg-background-6 flex items-center justify-center">
                                  💬
                                </span>
                                <span>WhatsApp Business</span>
                              </div>
                              <span className="text-[10px] font-semibold text-secondary dark:text-accent">
                                Verbunden
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-secondary/70 dark:text-accent/80 mb-4">
                              <div className="flex items-center gap-2">
                                <span className="size-6 rounded-full bg-background-1 dark:bg-background-6 flex items-center justify-center">
                                  📅
                                </span>
                                <span>Kalender</span>
                              </div>
                              <span className="text-[10px] font-semibold text-secondary dark:text-accent">
                                Testläufe
                              </span>
                            </div>

                            {/* Test-Szenario */}
                            <div className="rounded-xl bg-background-1 dark:bg-background-6 border border-secondary/10 dark:border-accent/15 p-3 space-y-2">
                              <div className="flex items-center justify-between text-[11px] text-secondary/70 dark:text-accent/80">
                                <span>Test: „Probetraining buchen“</span>
                                <span className="text-[10px] font-semibold text-secondary dark:text-accent">
                                  ✓ erfolgreich
                                </span>
                              </div>
                              <div className="h-1.5 rounded-full bg-background-2 dark:bg-background-7 overflow-hidden">
                                <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-[#38bdf8] via-[#6366f1] to-[#a855f7]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </figure>
                  </div>
                </div>
              </StackCardItem>

              {/* Step 3 – Regeln definieren */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="relative rounded-[20px]">
                    <div className={gradientTopClass} />
                    <div className={gradientLeftClass} />

                    <figure className="relative z-[1] p-8 rounded-[20px] bg-white dark:bg-background-5 space-y-6">
                      <figcaption className="space-y-2">
                        <h5>Ziele und Regeln für deine KI festlegen.</h5>
                        <p className="max-w-[260px] text-secondary/60 dark:text-accent/70">
                          Du definierst, welche Leads priorisiert werden, wie Probetrainings vergeben werden und welche
                          Angebote kommuniziert werden – die KI hält sich an deine Regeln.
                        </p>
                      </figcaption>

                      {/* Inneres Visual */}
                      <div className="rounded-2xl overflow-hidden max-w-[400px] w-full">
                        <div className="rounded-2xl bg-gradient-to-r from-[#38bdf8] via-[#6366f1] to-[#a855f7] p-[1px]">
                          <div className="h-[220px] md:h-[260px] rounded-[15px] bg-white dark:bg-background-4 p-5 flex flex-col gap-3">
                            <div className="flex items-center justify-between text-[11px] text-secondary/70 dark:text-accent/80 mb-1">
                              <span>Lead-Regeln</span>
                              <span className="rounded-full bg-background-1 dark:bg-background-6 px-2 py-0.5 text-[9px] text-secondary/70 dark:text-accent/70">
                                aktiv
                              </span>
                            </div>

                            <div className="space-y-2 text-[11px]">
                              <div className="flex items-start gap-2">
                                <span className="mt-[3px] size-4 rounded-full bg-accent/15 flex items-center justify-center text-[10px] text-accent">
                                  A
                                </span>
                                <p className="text-secondary/70 dark:text-accent/80">
                                  <span className="font-semibold text-secondary dark:text-accent">A-Leads:</span> Hohe
                                  Zahlungsbereitschaft, schnelle Terminvergabe, bevorzugte Slots.
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="mt-[3px] size-4 rounded-full bg-accent/15 flex items-center justify-center text-[10px] text-accent">
                                  B
                                </span>
                                <p className="text-secondary/70 dark:text-accent/80">
                                  <span className="font-semibold text-secondary dark:text-accent">B-Leads:</span>{' '}
                                  Standard-Follow-up mit 2–3 Nachfassern über WhatsApp & E-Mail.
                                </p>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="mt-[3px] size-4 rounded-full bg-secondary/10 dark:bg-accent/10 flex items-center justify-center text-[10px] text-secondary/70 dark:text-accent/70">
                                  C
                                </span>
                                <p className="text-secondary/70 dark:text-accent/80">
                                  <span className="font-semibold text-secondary dark:text-accent">C-Leads:</span>{' '}
                                  Langfristige Nurturing-Strecken und saisonale Aktionen.
                                </p>
                              </div>
                            </div>

                            <div className="mt-auto grid grid-cols-3 gap-2 text-[10px]">
                              {['Probetraining', 'Rückruf', 'Vertrag'].map((label) => (
                                <div
                                  key={label}
                                  className="rounded-lg bg-background-1 dark:bg-background-6 border border-secondary/10 dark:border-accent/15 px-2 py-2 text-center"
                                >
                                  <p className="font-semibold text-secondary dark:text-accent">{label}</p>
                                  <p className="text-secondary/60 dark:text-accent/60">Regel aktiv</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </figure>
                  </div>
                </div>
              </StackCardItem>

              {/* Step 4 – Live gehen */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="relative rounded-[20px]">
                    <div className={gradientTopClass} />
                    <div className={gradientLeftClass} />

                    <figure className="relative z-[1] p-8 rounded-[20px] bg-white dark:bg-background-5 space-y-6">
                      <figcaption className="space-y-2">
                        <h5>Live gehen und Automatisierung nutzen.</h5>
                        <p className="max-w-[260px] text-secondary/60 dark:text-accent/70">
                          Danach übernimmt PILAR SYSTEMS die Routine: Anfragen beantworten, Leads nachfassen und
                          Probetrainings koordinieren – dein Team konzentriert sich aufs Training.
                        </p>
                      </figcaption>

                      {/* Inneres Visual mit fetten Zahlen */}
                      <div className="rounded-2xl overflow-hidden max-w-[400px] w-full">
                        <Link href="/process-01">
                          <div className="rounded-2xl bg-gradient-to-r from-[#38bdf8] via-[#6366f1] to-[#a855f7] p-[1px] cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
                            <div className="h-[220px] md:h-[260px] rounded-[15px] bg-white dark:bg-background-4 p-5 flex flex-col justify-between">
                              <div className="flex items-center justify-between text-[11px] text-secondary/70 dark:text-accent/80 mb-2">
                                <span>Live-Automatisierung</span>
                                <span className="rounded-full bg-background-1 dark:bg-background-6 px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-secondary/70 dark:text-accent/70">
                                  aktiv
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-2 text-[11px] text-secondary/70 dark:text-accent/80">
                                <div className="rounded-xl bg-background-1 dark:bg-background-6 p-2">
                                  <p className="text-[10px] uppercase tracking-[0.14em] mb-1">Anfragen</p>
                                  <p className="text-lg font-semibold text-secondary dark:text-accent leading-none">
                                    +132
                                  </p>
                                  <p className="text-[10px] text-secondary/60 dark:text-accent/60 mt-1">
                                    letzte 30&nbsp;Tage
                                  </p>
                                </div>
                                <div className="rounded-xl bg-background-1 dark:bg-background-6 p-2">
                                  <p className="text-[10px] uppercase tracking-[0.14em] mb-1">Show-ups</p>
                                  <p className="text-lg font-semibold text-secondary dark:text-accent leading-none">
                                    +87%
                                  </p>
                                  <p className="text-[10px] text-secondary/60 dark:text-accent/60 mt-1">
                                    Probetrainings
                                  </p>
                                </div>
                                <div className="rounded-xl bg-background-1 dark:bg-background-6 p-2">
                                  <p className="text-[10px] uppercase tracking-[0.14em] mb-1">No-Shows</p>
                                  <p className="text-lg font-semibold text-secondary dark:text-accent leading-none">
                                    -34%
                                  </p>
                                  <p className="text-[10px] text-secondary/60 dark:text-accent/60 mt-1">
                                    durch Follow-ups
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-secondary/80 dark:text-accent/80 mt-3">
                                <span className="font-semibold text-secondary dark:text-accent">
                                  Details zum Ablauf ansehen
                                </span>
                                <span className="text-[13px]">↗</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </figure>
                  </div>
                </div>
              </StackCardItem>
            </StackCardWrapper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integration;
