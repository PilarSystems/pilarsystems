import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';

type ProjectCard = {
  id: string;
  title: string;
  subtitle: string;
  result: string;
  location: string;
  studioType: string;
};

const projects: ProjectCard[] = [
  {
    id: 'boutique-gym-berlin',
    title: 'Boutique-Gym in Berlin',
    subtitle: 'Mehr Probetrainings, weniger Zettelwirtschaft',
    result: '+68 % mehr gebuchte Probetrainings in 90 Tagen',
    location: 'Berlin',
    studioType: 'Boutique-Studio (ca. 800 Mitglieder)',
  },
  {
    id: 'kette-nrw',
    title: 'Studio-Kette in NRW',
    subtitle: 'Telefon-KI & Lead-Funnel auf Autopilot',
    result: '–45 % No-Shows bei Erstterminen',
    location: 'NRW',
    studioType: '3 Standorte, Mixed-Use-Gyms',
  },
  {
    id: 'pt-studio',
    title: 'PT- & Coaching-Studio',
    subtitle: 'WhatsApp-Funnel statt manueller Terminabstimmung',
    result: '3x mehr qualifizierte Anfragen pro Woche',
    location: 'Süddeutschland',
    studioType: 'Personal-Training & Online-Coaching',
  },
  {
    id: 'franchise-chain',
    title: 'Franchise-Setup',
    subtitle: 'Zentrale Regeln, lokale Automatisierung',
    result: 'Klare KPIs für Leads, Abschlüsse & Auslastung',
    location: 'DACH-weit',
    studioType: 'Franchise-/Lizenzsystem',
  },
];

const Projects = () => {
  const [main, second, third, fourth] = projects;

  return (
    <section className="pt-16 md:pt-20 lg:pt-[90px] xl:pt-[160px] pb-16 md:pb-20 lg:pb-[90px] xl:pb-[160px] bg-white dark:bg-black">
      <div className="main-container">
        {/* Heading */}
        <div className="text-center space-y-5 mb-10 md:mb-[70px]">
          <RevealAnimation delay={0.2}>
            <span className="badge badge-green">Ergebnisse</span>
          </RevealAnimation>
          <div className="space-y-3">
            <RevealAnimation delay={0.3}>
              <h2>So setzen Studios & Coaches PILAR SYSTEMS ein.</h2>
            </RevealAnimation>
            <RevealAnimation delay={0.4}>
              <p className="max-w-[680px] mx-auto">
                Beispiele aus der Praxis: Wie Studios mit PILAR mehr Probetrainings, höhere Abschlussquoten und weniger
                Verwaltungsaufwand erreichen – von Boutique-Gyms bis zu Kettenstrukturen.
              </p>
            </RevealAnimation>
          </div>
        </div>

        {/* Case Grid – alles Code, keine Bilder */}
        <div className="mb-14">
          <div className="grid grid-cols-12 gap-y-14 lg:gap-x-14">
            {/* Big Case */}
            <RevealAnimation delay={0.5}>
              <article className="col-span-12">
                <div className="space-y-6">
                  <div className="relative w-full rounded-[20px] overflow-hidden group cursor-pointer bg-gradient-to-br from-accent/10 via-secondary/5 to-secondary/20 dark:from-accent/15 dark:via-background-7 dark:to-background-8 p-[1px]">
                    <div className="rounded-[18px] bg-white/95 dark:bg-background-9/95 px-6 sm:px-10 py-8 sm:py-10 flex flex-col gap-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-1.5">
                          <p className="text-tagline-2 text-secondary/60 dark:text-accent/60 uppercase tracking-[0.16em]">
                            Erfolgsgeschichte
                          </p>
                          <h3 className="text-heading-5 sm:text-heading-4">{main.title}</h3>
                          <p className="text-tagline-1 text-secondary/80 dark:text-accent/80">{main.subtitle}</p>
                        </div>
                        <div className="text-left md:text-right space-y-1">
                          <p className="text-sm text-secondary/60 dark:text-accent/60">
                            {main.studioType}
                          </p>
                          <p className="inline-flex items-center rounded-full border border-secondary/20 dark:border-accent/30 px-3 py-1 text-xs font-medium text-secondary/80 dark:text-accent/80">
                            {main.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                        <div className="flex-1 rounded-2xl bg-secondary/90 dark:bg-background-6 px-5 py-4 flex items-center justify-between">
                          <p className="text-tagline-2 text-white/70">Kern-Ergebnis</p>
                          <p className="text-base sm:text-lg font-medium text-white text-right">{main.result}</p>
                        </div>
                        <div className="flex-1 flex flex-col gap-2 text-tagline-1 text-secondary/70 dark:text-accent/70">
                          <p className="before:content-[''] before:inline-block before:size-1.5 before:rounded-full before:bg-secondary/80 dark:before:bg-accent before:mr-2">
                            KI-Inbox & Telefon-KI statt Zettelwirtschaft.
                          </p>
                          <p className="before:content-[''] before:inline-block before:size-1.5 before:rounded-full before:bg-secondary/80 dark:before:bg-accent before:mr-2">
                            Automatisiertes Follow-up bis zum Probetraining.
                          </p>
                          <p className="before:content-[''] before:inline-block before:size-1.5 before:rounded-full before:bg-secondary/80 dark:before:bg-accent before:mr-2">
                            Klare Pipeline von Anfrage bis Vertragsabschluss.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                        <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">
                          *Zahlen basieren auf Pilotstudios & internen Szenario-Rechnungen. Ergebnisse können je nach
                          Standort, Angebot & Marketing variieren.
                        </p>
                        <LinkButton
                          href="/case-study"
                          className="btn btn-sm btn-secondary hover:btn-primary dark:btn-transparent dark:border-primary-50 w-full sm:w-auto text-center"
                        >
                          Weitere Cases ansehen
                        </LinkButton>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </RevealAnimation>

            {/* Case 2 */}
            <RevealAnimation delay={0.6}>
              <article className="col-span-12 lg:col-span-6">
                <div className="rounded-[20px] border border-secondary/10 dark:border-background-6 bg-background-1 dark:bg-background-8 px-6 py-6 space-y-4">
                  <p className="text-tagline-2 text-secondary/60 dark:text-accent/60 uppercase tracking-[0.16em]">
                    {second.location} · {second.studioType}
                  </p>
                  <h3 className="text-heading-6 sm:text-heading-5">{second.title}</h3>
                  <p className="text-tagline-1 text-secondary/80 dark:text-accent/80">{second.subtitle}</p>
                  <p className="inline-flex items-center rounded-full bg-secondary/10 dark:bg-accent/15 px-3 py-1 text-xs font-medium text-secondary dark:text-accent">
                    {second.result}
                  </p>
                </div>
              </article>
            </RevealAnimation>

            {/* Case 3 */}
            <RevealAnimation delay={0.7}>
              <article className="col-span-12 lg:col-span-6">
                <div className="rounded-[20px] border border-secondary/10 dark:border-background-6 bg-background-1 dark:bg-background-8 px-6 py-6 space-y-4">
                  <p className="text-tagline-2 text-secondary/60 dark:text-accent/60 uppercase tracking-[0.16em]">
                    {third.location} · {third.studioType}
                  </p>
                  <h3 className="text-heading-6 sm:text-heading-5">{third.title}</h3>
                  <p className="text-tagline-1 text-secondary/80 dark:text-accent/80">{third.subtitle}</p>
                  <p className="inline-flex items-center rounded-full bg-secondary/10 dark:bg-accent/15 px-3 py-1 text-xs font-medium text-secondary dark:text-accent">
                    {third.result}
                  </p>
                </div>
              </article>
            </RevealAnimation>

            {/* Case 4 */}
            <RevealAnimation delay={0.8}>
              <article className="col-span-12">
                <div className="rounded-[20px] border border-secondary/10 dark:border-background-6 bg-background-1 dark:bg-background-8 px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2 max-w-[480px]">
                    <p className="text-tagline-2 text-secondary/60 dark:text-accent/60 uppercase tracking-[0.16em]">
                      {fourth.location} · {fourth.studioType}
                    </p>
                    <h3 className="text-heading-6 sm:text-heading-5">{fourth.title}</h3>
                    <p className="text-tagline-1 text-secondary/80 dark:text-accent/80">{fourth.subtitle}</p>
                    <p className="text-tagline-1 text-secondary/80 dark:text-accent/80">{fourth.result}</p>
                  </div>
                  <div className="space-y-3 text-sm text-secondary/70 dark:text-accent/70 max-w-[360px]">
                    <p>
                      Ideal für Ketten, Franchises & Marken, die mehrere Standorte mit einer zentralen KI-Infrastruktur
                      steuern wollen.
                    </p>
                    <LinkButton
                      href="/contact-us?topic=case-study"
                      className="btn btn-sm btn-secondary hover:btn-primary dark:btn-transparent dark:border-primary-50 w-full sm:w-auto"
                    >
                      Eigene PILAR Success Story besprechen
                    </LinkButton>
                  </div>
                </div>
              </article>
            </RevealAnimation>
          </div>
        </div>

        {/* Bottom CTA */}
        <RevealAnimation delay={0.9}>
          <div className="text-center space-y-3">
            <LinkButton
              href="/case-study"
              className="btn btn-secondary btn-md hover:btn-primary dark:btn-transparent mx-auto"
            >
              Alle Erfolgsgeschichten ansehen
            </LinkButton>
            <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">
              Oder direkt loslegen und deine eigene PILAR Success Story schreiben.
            </p>
            <LinkButton
              href="/signup-01"
              className="btn btn-primary btn-sm hover:btn-white dark:hover:btn-accent mx-auto"
            >
              Jetzt mit PILAR starten
            </LinkButton>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default Projects;
