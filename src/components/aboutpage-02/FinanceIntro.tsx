import { CheckIcon } from '@/icons';
import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';

const principles = [
  { id: 1, label: 'Studioalltag zuerst – Technologie dahinter' },
  { id: 2, label: 'Klare Prozesse statt Feature-Overload' },
  { id: 3, label: 'Datenschutz & Sicherheit als Standard' },
];

const FinanceIntro = () => {
  return (
    <section className="py-12 md:py-32 lg:py-40 xl:py-48 2xl:py-[200px] overflow-hidden">
      <div className="main-container flex flex-col-reverse lg:flex-row items-center gap-y-12 gap-x-24">
        {/* Code-Visual statt Bild */}
        <div className="md:flex-1 relative flex justify-start w-full lg:w-auto overflow-hidden">
          <RevealAnimation delay={0.2}>
            <div className="relative w-full max-w-[420px] mx-auto">
              {/* Glows */}
              <div className="pointer-events-none absolute -top-10 -left-6 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -right-6 h-40 w-40 rounded-full bg-secondary/15 dark:bg-background-5/40 blur-3xl" />

              {/* Hauptkarte */}
              <div className="relative rounded-[24px] bg-gradient-to-br from-accent/14 via-background-1 to-background-3 dark:from-accent/20 dark:via-background-8 dark:to-background-9 border border-stroke-2/70 dark:border-stroke-6/70 px-6 py-6 md:px-7 md:py-7 space-y-5 shadow-2">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div>
                    <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/70">
                      Warum PILAR anders ist
                    </p>
                    <p className="text-tagline-1 text-secondary/85 dark:text-accent/85">
                      Entscheidungen, die vom Studioalltag kommen – nicht vom Whiteboard.
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/90 animate-pulse" />
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80" />
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-300/80" />
                  </div>
                </div>

                {/* Metrics-Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-background-1/95 dark:bg-background-9/90 border border-stroke-2/70 dark:border-stroke-6/70 px-3 py-3 space-y-1.5">
                    <p className="text-[11px] text-secondary/60 dark:text-accent/60">Show-ups Probetraining</p>
                    <p className="text-heading-6">+87%</p>
                    <p className="text-[11px] text-emerald-400/80">durch strukturierte Follow-ups</p>
                  </div>
                  <div className="rounded-2xl bg-background-1/95 dark:bg-background-9/90 border border-stroke-2/70 dark:border-stroke-6/70 px-3 py-3 space-y-1.5">
                    <p className="text-[11px] text-secondary/60 dark:text-accent/60">Kanäle im Einsatz</p>
                    <p className="text-heading-6">4+</p>
                    <p className="text-[11px] text-secondary/60 dark:text-accent/60">Telefon, WhatsApp, E-Mail, DMs</p>
                  </div>
                  <div className="rounded-2xl bg-background-1/95 dark:bg-background-9/90 border border-stroke-2/70 dark:border-stroke-6/70 px-3 py-3 space-y-1.5">
                    <p className="text-[11px] text-secondary/60 dark:text-accent/60">Manuelle To-dos</p>
                    <p className="text-heading-6 text-emerald-400">−60%</p>
                    <p className="text-[11px] text-secondary/60 dark:text-accent/60">an der Rezeption</p>
                  </div>
                </div>

                {/* Vergleich-Block */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-2xl bg-background-1/95 dark:bg-background-9/95 border border-dashed border-stroke-2/70 dark:border-stroke-6/70 px-3 py-3 space-y-2">
                    <p className="text-[11px] text-secondary/60 dark:text-accent/60">Ohne Pilar</p>
                    <ul className="space-y-1.5 text-[11px] text-secondary/80 dark:text-accent/80">
                      <li>Mehrere Handys &amp; Postfächer</li>
                      <li>Leads gehen im Alltag unter</li>
                      <li>Keine klaren Zahlen zu Kampagnen</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-background-1/95 dark:bg-background-9/95 border border-stroke-2/70 dark:border-stroke-6/70 px-3 py-3 space-y-2">
                    <p className="text-[11px] text-secondary/60 dark:text-accent/60">Mit Pilar Systems</p>
                    <ul className="space-y-1.5 text-[11px] text-secondary/80 dark:text-accent/80">
                      <li>Eine KI-Inbox für alle Anfragen</li>
                      <li>Standardfälle laufen automatisch</li>
                      <li>Dashboard statt Bauchgefühl</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Badge-Karte oben rechts */}
              <div className="absolute -top-4 right-3 md:right-0">
                <div className="bg-background-1/95 dark:bg-background-9/95 border border-stroke-2/70 dark:border-stroke-6/70 rounded-2xl px-4 py-2 shadow-sm">
                  <p className="text-[11px] text-secondary/70 dark:text-accent/75">
                    Entwickelt aus echten Studio-Prozessen – nicht aus Präsentationen.
                  </p>
                </div>
              </div>
            </div>
          </RevealAnimation>
        </div>

        {/* Text / Werte */}
        <div className="md:flex-1 flex flex-col lg:items-start lg:text-left">
          <RevealAnimation delay={0.2}>
            <h2 className="mb-3">Warum es Pilar Systems gibt – und was wir anders machen.</h2>
          </RevealAnimation>
          <RevealAnimation delay={0.3}>
            <p className="mb-6">
              Pilar Systems ist nicht im Meetingraum eines Großkonzerns entstanden, sondern aus der Realität: volle
              Telefone, unbeantwortete WhatsApps, gestresste Teams und Leads, die einfach verschwinden. Wir bauen eine
              Infrastruktur, die diesen Alltag auffängt – und Studios hilft, planbar zu wachsen.
            </p>
          </RevealAnimation>
          <RevealAnimation delay={0.35}>
            <p className="mb-6">
              Unsere Werte sind dabei klar: Wir entwickeln nur Features, die im Studioalltag wirklich genutzt werden,
              machen komplexe Prozesse einfach bedienbar und achten konsequent auf Datenschutz und Datensicherheit.
            </p>
          </RevealAnimation>

          <ul className="mb-10 md:mb-14 space-y-2 md:space-y-3.5">
            {principles.map((item, idx) => (
              <RevealAnimation key={item.id} delay={0.4 + idx * 0.1}>
                <li className="text-tagline-1 font-medium flex items-center gap-3 dark:text-accent">
                  <span className="bg-secondary dark:bg-accent/10 rounded-full size-[18px] flex items-center justify-center">
                    <CheckIcon />
                  </span>
                  {item.label}
                </li>
              </RevealAnimation>
            ))}
          </ul>

          <RevealAnimation delay={0.7}>
            <div>
              <LinkButton
                href="/signup-01"
                className="btn btn-secondary hover:btn-white dark:btn-white-dark btn-xl block md:inline-block w-full md:w-auto mx-auto"
              >
                Jetzt mit Pilar starten
              </LinkButton>
            </div>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default FinanceIntro;
