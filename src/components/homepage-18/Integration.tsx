import gradient28 from '@public/images/gradient/gradient-28.png';
import gradient31 from '@public/images/gradient/gradient-31.png';
import gradient46 from '@public/images/gradient/gradient-46.png';
import Image from 'next/image';
import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';
import StackCardItem from '../ui/stack-card/StackCardItem';
import StackCardWrapper from '../ui/stack-card/StackCardWrapper';

const Integration = () => {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-20 lg:pt-[90px] xl:pt-[150px] pb-16 md:pb-20 lg:pb-[90px] xl:pb-[250px]">
      {/* große Hintergrund-Gradients */}
      <div className="pointer-events-none select-none absolute -top-40 -left-24 w-[260px] opacity-70 md:w-[320px]">
        <Image src={gradient28} alt="" className="w-full h-auto object-contain" />
      </div>
      <div className="pointer-events-none select-none absolute -bottom-52 -right-20 w-[260px] opacity-70 md:w-[340px]">
        <Image src={gradient46} alt="" className="w-full h-auto object-contain" />
      </div>

      <div className="bg-background-2 dark:bg-background-5/80">
        <div className="main-container">
          <div className="flex flex-col lg:flex-row items-start gap-y-24 gap-x-[140px]">
            {/* Text / Sticky Intro */}
            <div className="w-full lg:flex-1 lg:sticky lg:top-28 lg:max-w-full max-w-[520px] lg:mx-0 mx-auto text-center lg:text-left">
              <RevealAnimation delay={0.2}>
                <span className="badge badge-green mb-5">Ablauf</span>
              </RevealAnimation>
              <RevealAnimation delay={0.3}>
                <h2 className="mb-3 max-w-[529px]">So wird aus Anfragen automatisch Umsatz.</h2>
              </RevealAnimation>
              <RevealAnimation delay={0.4}>
                <p className="mb-7 lg:max-w-[620px]">
                  Von der Online-Buchung über das Setup bis zur laufenden Automatisierung – PILAR SYSTEMS fügt sich in
                  deinen Alltag ein, ohne dein Team zu überfordern. Klare Schritte, keine IT-Projekte.
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

            {/* Scroll / Stack Cards – nur Code-UI, keine Screenshots */}
            <StackCardWrapper
              topOffset="15vh"
              gap="24px"
              initDelay={100}
              className="w-full lg:flex-1 lg:max-w-full md:max-w-[50%] sm:max-w-[60%] lg:mx-0 mx-auto max-w-full"
            >
              {/* Step 1 */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="rounded-[20px] relative z-[10] overflow-hidden border border-border/40 bg-background-1/80 dark:bg-background-7/80 p-6">
                    <div className="pointer-events-none select-none absolute -top-10 -right-8 w-[160px] opacity-80">
                      <Image src={gradient31} alt="" className="w-full h-auto object-contain" />
                    </div>

                    <div className="space-y-4 relative z-10">
                      <h5 className="text-heading-6">Online starten & Setup-Wizard durchlaufen.</h5>
                      <p className="text-tagline-1 text-secondary/70 dark:text-accent/70 max-w-[260px]">
                        Plan wählen, Account erstellen, Standort & Öffnungszeiten eintragen – alles in wenigen Minuten
                        direkt im Browser.
                      </p>

                      {/* Code-UI: kleiner Setup-Wizard */}
                      <div className="mt-4 rounded-2xl bg-background-3 dark:bg-background-8 p-4 space-y-3">
                        <div className="flex items-center justify-between text-[11px] text-secondary/70 dark:text-accent/70 mb-1">
                          <span>Setup-Status</span>
                          <span>3 / 5</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-background-2 dark:bg-background-7 overflow-hidden">
                          <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500" />
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-3 text-[11px]">
                          <span className="rounded-full bg-white/80 dark:bg-background-6 px-3 py-1 text-center">
                            Studio-Daten
                          </span>
                          <span className="rounded-full bg-white/40 dark:bg-background-6/60 px-3 py-1 text-center">
                            Kanäle
                          </span>
                          <span className="rounded-full bg-white/20 dark:bg-background-6/40 px-3 py-1 text-center">
                            Regeln
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StackCardItem>

              {/* Step 2 */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="rounded-[20px] relative z-[10] overflow-hidden border border-border/40 bg-background-1/80 dark:bg-background-7/80 p-6">
                    <div className="pointer-events-none select-none absolute -bottom-10 -left-10 w-[180px] opacity-80">
                      <Image src={gradient28} alt="" className="w-full h-auto object-contain" />
                    </div>

                    <div className="space-y-4 relative z-10">
                      <h5 className="text-heading-6">Systeme verbinden & Szenarien testen.</h5>
                      <p className="text-tagline-1 text-secondary/70 dark:text-accent/70 max-w-[260px]">
                        Telefonanlage, WhatsApp, E-Mail-Postfach und Kalender werden angebunden – danach spielst du
                        typische Member-Szenarien einmal durch.
                      </p>

                      {/* Code-UI: Channel-Matrix */}
                      <div className="mt-4 rounded-2xl bg-background-3 dark:bg-background-8 p-4 space-y-3">
                        <div className="grid grid-cols-4 gap-2 text-[11px]">
                          {['Telefon', 'WhatsApp', 'E-Mail', 'Kalender'].map((label) => (
                            <div
                              key={label}
                              className="flex flex-col items-center justify-center rounded-lg bg-white/80 dark:bg-background-6/90 px-2 py-2"
                            >
                              <span className="mb-1 h-1.5 w-6 rounded-full bg-gradient-to-r from-cyan-300 to-sky-500" />
                              <span>{label}</span>
                              <span className="mt-1 text-[10px] text-emerald-500 dark:text-emerald-300">
                                verbunden
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="mt-2 text-[11px] text-secondary/60 dark:text-accent/60">
                          Test-Calls & Test-Nachrichten zeigen dir, wie sich die KI aus Sicht deiner Interessenten
                          verhält.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </StackCardItem>

              {/* Step 3 */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="rounded-[20px] relative z-[10] overflow-hidden border border-border/40 bg-background-1/80 dark:bg-background-7/80 p-6">
                    <div className="pointer-events-none select-none absolute -top-10 -right-14 w-[200px] opacity-80">
                      <Image src={gradient46} alt="" className="w-full h-auto object-contain" />
                    </div>

                    <div className="space-y-4 relative z-10">
                      <h5 className="text-heading-6">Ziele & Regeln für deine KI festlegen.</h5>
                      <p className="text-tagline-1 text-secondary/70 dark:text-accent/70 max-w-[260px]">
                        Lead-Prioritäten, Probetrainings-Regeln, Angebote & Tonalität – du definierst das Spielfeld,
                        die KI hält sich daran.
                      </p>

                      {/* Code-UI: Regel-Liste */}
                      <div className="mt-4 rounded-2xl bg-background-3 dark:bg-background-8 p-4 space-y-3">
                        <div className="flex items-center justify-between text-[11px]">
                          <span>Regel-Engine</span>
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-500">
                            aktiv
                          </span>
                        </div>
                        <ul className="space-y-2 text-[11px] text-secondary/70 dark:text-accent/70">
                          <li className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-sky-400" />
                            Leads mit Vertrag-Interesse &gt; Probetraining &gt; Probetraining-Anfrage
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-sky-400" />
                            Max. 2 Probetrainings-Slots pro Stunde & pro Trainer
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-sky-400" />
                            Angebote nur innerhalb der definierten Kampagnenzeiträume
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </StackCardItem>

              {/* Step 4 */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="rounded-[20px] relative z-[10] overflow-hidden border border-border/40 bg-background-1/80 dark:bg-background-7/80 p-6">
                    <div className="pointer-events-none select-none absolute -bottom-12 -left-12 w-[190px] opacity-80">
                      <Image src={gradient31} alt="" className="w-full h-auto object-contain" />
                    </div>

                    <div className="space-y-4 relative z-10">
                      <h5 className="text-heading-6">Live gehen & kontinuierlich optimieren.</h5>
                      <p className="text-tagline-1 text-secondary/70 dark:text-accent/70 max-w-[260px]">
                        Nach dem Go-Live läuft der Alltag über PILAR – du bekommst klare Zahlen zu Leads, Show-ups &
                        Abschlüssen und kannst Regeln jederzeit anpassen.
                      </p>

                      {/* Code-UI: Mini-Dashboard aus reinen Divs */}
                      <div className="mt-4 rounded-2xl bg-background-3 dark:bg-background-8 p-4 space-y-3">
                        <div className="grid grid-cols-3 gap-3 text-[11px]">
                          <div className="rounded-lg bg-white/80 dark:bg-background-6/90 p-2">
                            <p className="text-secondary/60 dark:text-accent/60 mb-1">Leads (30 Tage)</p>
                            <p className="text-base font-semibold">+214</p>
                          </div>
                          <div className="rounded-lg bg-white/80 dark:bg-background-6/90 p-2">
                            <p className="text-secondary/60 dark:text-accent/60 mb-1">Show-up Rate</p>
                            <p className="text-base font-semibold">+18%</p>
                          </div>
                          <div className="rounded-lg bg-white/80 dark:bg-background-6/90 p-2">
                            <p className="text-secondary/60 dark:text-accent/60 mb-1">No-Shows</p>
                            <p className="text-base font-semibold text-emerald-500">-32%</p>
                          </div>
                        </div>
                        <p className="mt-2 text-[11px] text-secondary/60 dark:text-accent/60">
                          Alles live im Dashboard sichtbar – ohne dass du dich durch fünf verschiedene Tools klicken
                          musst.
                        </p>
                      </div>
                    </div>
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
