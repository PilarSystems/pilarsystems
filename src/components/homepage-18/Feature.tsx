import Link from 'next/link';
import RevealAnimation from '../animation/RevealAnimation';

const Feature = () => {
  return (
    <section className="pt-16 md:pt-20 lg:pt-[90px] xl:pt-[100px] pb-16 md:pb-20 lg:pb-[90px] xl:pb-[100px] bg-white dark:bg-black">
      <div className="main-container">
        <div className="text-center space-y-5 max-w-[750px] mx-auto mb-10 md:mb-[70px]">
          <RevealAnimation delay={0.2}>
            <span className="badge badge-green">Funktionen</span>
          </RevealAnimation>
          <div>
            <RevealAnimation delay={0.3}>
              <h2 className="mb-3">Eine Plattform. Alle KI-Module für dein Studio.</h2>
            </RevealAnimation>
            <RevealAnimation delay={0.4}>
              <p className="text-secondary/60 dark:text-accent/60 max-w-[600px] mx-auto">
                PILAR SYSTEMS bündelt KI-Rezeption, Telefonanlage, WhatsApp, E-Mail, DMs, Kalender, Trainingspläne,
                Growth-Analytics und mehr in einem Dashboard – modular aufgebaut, damit du nur das buchst, was dein Gym
                wirklich braucht.
              </p>
            </RevealAnimation>
            <RevealAnimation delay={0.5}>
              <div className="mt-4">
                <Link
                  href="/signup-01"
                  className="inline-flex items-center text-tagline-2 font-medium text-secondary dark:text-accent underline underline-offset-4"
                >
                  Jetzt PILAR testen – in wenigen Minuten startklar
                </Link>
              </div>
            </RevealAnimation>
          </div>
        </div>

        {/* Feature Items */}
        <div className="grid grid-cols-12 space-y-8 md:space-y-0 md:gap-8 mb-10 xl:mb-18">
          {/* Card 1 */}
          <RevealAnimation delay={0.5}>
            <div className="col-span-12 md:col-span-6 lg:col-span-8 p-8 rounded-[20px] bg-background-3 dark:bg-background-7 space-y-6">
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">KI-Rezeption für alle Kanäle.</h5>
                <p className="max-w-[470px]">
                  Telefon, WhatsApp, E-Mail und Instagram-DMs werden von deiner KI angenommen, vorqualifiziert und bis
                  zum gebuchten Probetraining oder Vertrag begleitet – 24/7 in deinem Studio-Branding, ohne Callcenter
                  oder Minijobs.
                </p>
              </div>

              {/* visuelles Element ohne Bilddatei */}
              <div className="w-full">
                <div className="relative w-full h-[220px] rounded-2xl bg-gradient-to-br from-accent/20 via-background-1 to-background-3 dark:from-accent/30 dark:via-background-8 dark:to-background-9 overflow-hidden">
                  <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/15 dark:bg-background-6/40 blur-2xl" />
                  <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-secondary/20 dark:bg-accent/25 blur-3xl" />

                  <div className="relative flex h-full flex-col justify-between px-6 py-5">
                    {/* Channel Tags */}
                    <div className="flex flex-wrap gap-2">
                      {['Telefon', 'WhatsApp', 'E-Mail', 'DMs'].map((label) => (
                        <span
                          key={label}
                          className="rounded-full bg-background-1/80 px-3 py-1 text-[11px] text-secondary/80 backdrop-blur-sm dark:bg-background-9/80 dark:text-accent/80"
                        >
                          {label}
                        </span>
                      ))}
                    </div>

                    {/* Fake Conversation */}
                    <div className="space-y-2">
                      <div className="flex gap-2 max-w-[80%]">
                        <div className="mt-1 size-6 rounded-full bg-accent/80" />
                        <div className="rounded-2xl bg-white/90 px-3.5 py-2 text-[12px] text-secondary/90 shadow-sm dark:bg-background-9/90 dark:text-accent/90">
                          „Hi, ich möchte ein Probetraining buchen.“
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 max-w-[85%] ml-auto">
                        <div className="rounded-2xl bg-secondary/90 px-3.5 py-2 text-[12px] text-white shadow-sm dark:bg-accent/90">
                          „Sehr gern! Ich habe dir morgen 18:30 Uhr im Kalender eingetragen.“
                        </div>
                      </div>
                    </div>

                    {/* KPI Footer */}
                    <div className="mt-2 flex items-center justify-between text-[11px] text-secondary/70 dark:text-accent/70">
                      <span>24/7 erreichbar</span>
                      <span className="rounded-full bg-background-1/70 px-2.5 py-1 text-[10px] dark:bg-background-9/70">
                        +87% mehr Show-ups*
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealAnimation>

          {/* Card 2 */}
          <RevealAnimation delay={0.6}>
            <div className="col-span-12 md:col-span-6 lg:col-span-4 p-8 rounded-[20px] bg-background-3 dark:bg-background-7 space-y-6">
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">Setup-Wizard & Integrationen.</h5>
                <p className="max-w-[240px]">
                  Geführtes Onboarding statt IT-Projekt: Verbinde Telefonanlage, WhatsApp Business, Kalender und
                  bestehende Studio-Software in wenigen Schritten – fertig konfiguriert über den Setup-Wizard.
                </p>
              </div>

              <div className="w-full">
                <div className="relative h-[200px] w-full overflow-hidden rounded-2xl bg-gradient-to-tr from-accent/10 via-background-1 to-background-3 dark:from-accent/20 dark:via-background-8 dark:to-background-9">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.3),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.5),_transparent_55%)]" />

                  <div className="relative flex h-full flex-col justify-between px-5 py-4 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-background-1/80 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-secondary/70 dark:bg-background-9/80 dark:text-accent/80">
                        Setup-Wizard
                      </span>
                      <span className="text-secondary/60 dark:text-accent/60">in &lt; 10 Min.</span>
                    </div>

                    <div className="space-y-2">
                      {['Telefonanlage verbinden', 'WhatsApp Business verknüpfen', 'Kalender & Öffnungszeiten setzen'].map(
                        (item, i) => (
                          <div key={item} className="flex items-center justify-between rounded-xl bg-background-1/90 px-3 py-2 dark:bg-background-9/90">
                            <span className="text-[11px] text-secondary/80 dark:text-accent/80">{item}</span>
                            <span className="text-[10px] text-emerald-500/90">{i < 2 ? 'fertig' : 'nächster Schritt'}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealAnimation>

          {/* Card 3 */}
          <RevealAnimation delay={0.7}>
            <div className="col-span-12 md:col-span-6 lg:col-span-4 p-8 rounded-[20px] bg-background-3 dark:bg-background-7 space-y-6">
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">KI-Coach & Creative Planner.</h5>
                <p>
                  Erstelle individuelle Trainingspläne, Check-in-Workflows und Content-Ideen mit KI-Unterstützung.
                  Deine Mitglieder erhalten klare Pläne, dein Team bekommt weniger Rückfragen – und mehr Zeit auf der
                  Fläche.
                </p>
              </div>

              <div className="w-full">
                <div className="relative h-[210px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-accent/14 via-background-1 to-background-3 dark:from-accent/22 dark:via-background-8 dark:to-background-9">
                  <div className="absolute -top-8 right-4 h-16 w-16 rounded-2xl border border-white/20 bg-background-1/60 text-[10px] text-secondary/80 shadow-sm backdrop-blur-sm dark:border-background-7 dark:bg-background-9/70 dark:text-accent/80">
                    <div className="flex h-full flex-col justify-center gap-1 px-3">
                      <span className="text-[9px] uppercase tracking-[0.14em]">Plan</span>
                      <span>Push / Pull / Legs</span>
                      <span className="text-[9px] text-secondary/60 dark:text-accent/60">4x pro Woche</span>
                    </div>
                  </div>

                  <div className="relative flex h-full flex-col justify-end px-5 py-5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-secondary/70 dark:text-accent/70">
                        <span>Trainingsplan „Hypertrophie“</span>
                        <span className="rounded-full bg-background-1/70 px-2 py-1 text-[10px] dark:bg-background-9/70">
                          generiert
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[10px]">
                        {['Brust / Rücken', 'Beine / Core', 'Schulter / Arme'].map((b) => (
                          <div
                            key={b}
                            className="rounded-lg bg-background-1/80 px-2 py-2 text-secondary/80 dark:bg-background-9/80 dark:text-accent/80"
                          >
                            {b}
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-[11px] text-secondary/65 dark:text-accent/65">
                        + Content-Hooks & Posts für deine Socials passend zu Trainingsfokus & Zielgruppe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealAnimation>

          {/* Card 4 */}
          <RevealAnimation delay={0.8}>
            <div className="col-span-12 md:col-span-6 lg:col-span-8 p-8 rounded-[20px] bg-background-3 dark:bg-background-7 space-y-6">
              <div className="space-y-2 max-w-[360px]">
                <h5 className="max-sm:text-heading-6">Growth-Analytics, White-Label & Affiliate-ready.</h5>
                <p className="max-w-[360px]">
                  Behalte Leads, Abschlüsse, No-Shows und Kampagnen-Performance im Blick. Mit optionalem White-Label,
                  Multi-Studio-Add-on und Affiliate-Integration wächst PILAR mit dir – egal ob Einzelstudio,
                  Franchisekette oder Agency-Setup.
                </p>
              </div>

              <div className="w-full">
                <div className="relative flex h-[220px] w-full flex-col justify-between rounded-2xl bg-gradient-to-br from-accent/16 via-background-1 to-background-3 px-5 py-5 dark:from-accent/24 dark:via-background-8 dark:to-background-9">
                  {/* Mini Chart Bars */}
                  <div className="flex items-end gap-2">
                    {[60, 80, 45, 95].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-full bg-background-1/60 dark:bg-background-9/60"
                      >
                        <div
                          className="w-full rounded-full bg-secondary/80 dark:bg-accent/80"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-secondary/70 dark:text-accent/70">
                    <div className="space-y-1">
                      <p>Leads → Verträge</p>
                      <p className="text-[10px] text-secondary/60 dark:text-accent/60">
                        Conversion, No-Show-Rate & Kampagnen-Performance auf einen Blick.
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] uppercase tracking-[0.14em]">Module</p>
                      <p>White-Label · Multi-Studio · Affiliate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default Feature;
