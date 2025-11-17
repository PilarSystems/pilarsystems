import Link from 'next/link';
import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';
import StackCardItem from '../ui/stack-card/StackCardItem';
import StackCardWrapper from '../ui/stack-card/StackCardWrapper';

const Integration = () => {
  return (
    <section className="pt-16 md:pt-20 lg:pt-[90px] xl:pt-[150px] pb-16 md:pb-20 lg:pb-[90px] xl:pb-[250px]">
      <div className="bg-background-2 dark:bg-background-5">
        <div className="main-container">
          <div className="flex flex-col lg:flex-row items-start gap-y-24 gap-x-[140px]">
            {/* Left copy */}
            <div className="w-full lg:flex-1 lg:sticky lg:top-28 lg:max-w-full max-w-[520px] lg:mx-0 mx-auto text-center lg:text-left">
              <RevealAnimation delay={0.2}>
                <span className="badge badge-green mb-5">Ablauf</span>
              </RevealAnimation>
              <RevealAnimation delay={0.3}>
                <h2 className="mb-3 max-w-[529px]">So wird aus Anfragen automatisch Umsatz.</h2>
              </RevealAnimation>
              <RevealAnimation delay={0.4}>
                <p className="mb-7 lg:max-w-[620px]">
                  Von der Online-Buchung über das Setup bis zur laufenden Automatisierung – Pilar Systems fügt sich in
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

            {/* Right: Stack cards – nur visuelle Layer geändert */}
            <StackCardWrapper
              topOffset="15vh"
              gap="24px"
              initDelay={100}
              className="w-full lg:flex-1 lg:max-w-full md:max-w-[50%] sm:max-w-[60%] lg:mx-0 mx-auto max-w-full"
            >
              {/* Step 1 */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="p-2.5 rounded-[20px] relative z-[10] overflow-hidden">
                    {/* Gradient Frame via CSS statt Bild */}
                    <div className="pointer-events-none absolute inset-[-60%] -z-10 rotate-[-41deg] bg-gradient-to-tr from-accent/25 via-background-1/40 to-secondary/25 dark:from-accent/35 dark:via-background-8/60 dark:to-background-5/60" />

                    <div className="space-y-6 rounded-xl bg-white p-8 dark:bg-background-5">
                      <div className="space-y-2">
                        <h5>Online starten und Setup-Wizard durchlaufen.</h5>
                        <p className="max-w-[250px]">
                          Dein Studio wählt einen Plan, erstellt einen Account und führt den geführten Setup-Wizard
                          durch – ganz ohne Telefontermin oder Vor-Ort-Besuch.
                        </p>
                      </div>

                      {/* Fake UI Card */}
                      <div className="relative w-full rounded-2xl bg-gradient-to-br from-accent/15 via-background-1 to-background-2 p-4 dark:from-accent/20 dark:via-background-7 dark:to-background-8">
                        <div className="mb-3 flex items-center justify-between text-[11px] text-secondary/70 dark:text-accent/70">
                          <span className="rounded-full bg-background-1/70 px-3 py-1 text-[10px] uppercase tracking-[0.14em] dark:bg-background-9/70">
                            Setup-Wizard
                          </span>
                          <span>Schritt 1/4</span>
                        </div>
                        <div className="space-y-2 text-[11px]">
                          <div className="flex items-center justify-between rounded-xl bg-background-1/90 px-3 py-2 dark:bg-background-9/90">
                            <span>Plan wählen (Basic / Pro / Elite)</span>
                            <span className="text-emerald-500/90">fertig</span>
                          </div>
                          <div className="flex items-center justify-between rounded-xl bg-background-1/90 px-3 py-2 dark:bg-background-9/90">
                            <span>Studio-Daten eintragen</span>
                            <span className="text-secondary/60 dark:text-accent/60">aktiv</span>
                          </div>
                          <div className="flex items-center justify-between rounded-xl bg-background-1/50 px-3 py-2 dark:bg-background-9/50">
                            <span>Kanäle vorbereiten</span>
                            <span className="text-secondary/40 dark:text-accent/40">als Nächstes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StackCardItem>

              {/* Step 2 */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="p-2.5 rounded-[20px] relative z-[10] overflow-hidden">
                    <div className="pointer-events-none absolute inset-[-60%] -z-10 rotate-[-41deg] bg-gradient-to-tr from-accent/20 via-background-1/30 to-secondary/20 dark:from-accent/30 dark:via-background-8/50 dark:to-background-5/50" />

                    <div className="space-y-6 rounded-xl bg-white p-8 dark:bg-background-5">
                      <div className="space-y-2">
                        <h5>Systeme verbinden und alles testen.</h5>
                        <p className="max-w-[250px]">
                          Telefonanlage, WhatsApp, E-Mail-Postfach und Kalender werden angebunden – danach testest du
                          gemeinsam mit uns typische Szenarien aus Sicht deiner Mitglieder.
                        </p>
                      </div>

                      <div className="relative w-full rounded-2xl bg-gradient-to-br from-accent/12 via-background-1 to-background-2 p-4 dark:from-accent/22 dark:via-background-7 dark:to-background-8">
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          {['Telefonanlage', 'WhatsApp', 'E-Mail', 'Kalender'].map((label, idx) => (
                            <div
                              key={label}
                              className="flex items-center justify-between rounded-xl bg-background-1/90 px-3 py-2 dark:bg-background-9/90"
                            >
                              <span>{label}</span>
                              <span
                                className={
                                  idx < 2
                                    ? 'text-emerald-500/90'
                                    : 'text-secondary/55 dark:text-accent/60'
                                }
                              >
                                {idx < 2 ? 'verbunden' : 'ausstehend'}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between text-[10px] text-secondary/60 dark:text-accent/60">
                          <span>Test-Call & Test-WhatsApp aus Sicht eines Interessenten</span>
                          <span>✓ Szenarien durchgespielt</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StackCardItem>

              {/* Step 3 */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="p-2.5 rounded-[20px] relative z-[10] overflow-hidden">
                    <div className="pointer-events-none absolute inset-[-60%] -z-10 rotate-[-41deg] bg-gradient-to-tr from-accent/18 via-background-1/30 to-secondary/18 dark:from-accent/28 dark:via-background-8/50 dark:to-background-5/50" />

                    <div className="space-y-6 rounded-xl bg-white p-8 dark:bg-background-5">
                      <div className="space-y-2">
                        <h5>Ziele und Regeln für deine KI festlegen.</h5>
                        <p className="max-w-[250px]">
                          Du definierst, welche Leads priorisiert werden, wie Probetrainings vergeben werden und welche
                          Angebote kommuniziert werden – die KI hält sich an deine Regeln.
                        </p>
                      </div>

                      <div className="relative w-full rounded-2xl bg-gradient-to-br from-accent/12 via-background-1 to-background-2 p-4 dark:from-accent/22 dark:via-background-7 dark:to-background-8">
                        <div className="space-y-3 text-[11px]">
                          <div className="flex items-center justify-between">
                            <span className="rounded-full bg-background-1/80 px-3 py-1 text-[10px] uppercase tracking-[0.14em] dark:bg-background-9/80">
                              Lead-Regeln
                            </span>
                            <span className="text-secondary/60 dark:text-accent/60">3 aktive Regeln</span>
                          </div>

                          <ul className="space-y-2">
                            <li className="flex items-center justify-between rounded-xl bg-background-1/90 px-3 py-2 dark:bg-background-9/90">
                              <span>Leads mit Tel.-Nr. → Priorität hoch</span>
                              <span className="text-emerald-500/90">aktiv</span>
                            </li>
                            <li className="flex items-center justify-between rounded-xl bg-background-1/90 px-3 py-2 dark:bg-background-9/90">
                              <span>No-Shows → automatische Nachfass-Nachricht</span>
                              <span className="text-emerald-500/90">aktiv</span>
                            </li>
                            <li className="flex items-center justify-between rounded-xl bg-background-1/60 px-3 py-2 dark:bg-background-9/60">
                              <span>Upgrade-Angebote nach 8 Wochen</span>
                              <span className="text-secondary/55 dark:text-accent/60">geplant</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </StackCardItem>

              {/* Step 4 */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="p-2.5 rounded-[20px] relative z-[10] overflow-hidden">
                    <div className="pointer-events-none absolute inset-[-60%] -z-10 rotate-[245deg] bg-gradient-to-tr from-accent/22 via-background-1/35 to-secondary/22 dark:from-accent/32 dark:via-background-8/55 dark:to-background-5/55" />

                    <div className="space-y-6 rounded-xl bg-white p-8 dark:bg-background-5">
                      <div className="space-y-2">
                        <h5>Live gehen und Automatisierung nutzen.</h5>
                        <p className="max-w-[250px]">
                          Danach übernimmt Pilar Systems die Routine: Anfragen beantworten, Leads nachfassen und
                          Probetrainings koordinieren – dein Team konzentriert sich aufs Training.
                        </p>
                      </div>

                      <div className="relative w-full rounded-2xl bg-gradient-to-br from-accent/16 via-background-1 to-background-2 p-4 dark:from-accent/26 dark:via-background-7 dark:to-background-9">
                        <div className="flex items-center justify-between text-[11px] text-secondary/70 dark:text-accent/70 mb-3">
                          <span>Status: Live</span>
                          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-400">
                            Live-Automatisierung aktiv
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-[10px]">
                          <div className="rounded-xl bg-background-1/85 p-2 dark:bg-background-9/85">
                            <p>Neue Anfragen</p>
                            <p className="mt-1 text-emerald-500/90">+38% / Monat</p>
                          </div>
                          <div className="rounded-xl bg-background-1/85 p-2 dark:bg-background-9/85">
                            <p>No-Show-Rate</p>
                            <p className="mt-1 text-emerald-500/90">-24%</p>
                          </div>
                          <div className="rounded-xl bg-background-1/85 p-2 dark:bg-background-9/85">
                            <p>Reaktionszeit</p>
                            <p className="mt-1 text-emerald-500/90">&lt; 1 Min</p>
                          </div>
                        </div>

                        <div className="mt-4 text-right text-[11px]">
                          <Link href="/process-01" className="underline underline-offset-4 text-secondary/75 dark:text-accent/80">
                            Detaillierten Ablauf ansehen
                          </Link>
                        </div>
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
