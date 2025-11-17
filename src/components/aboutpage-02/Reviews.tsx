import RevealAnimation from '../animation/RevealAnimation';

const Reviews = () => {
  return (
    <section className="max-lg:mt-12 overflow-hidden">
      <div className="main-container">
        <RevealAnimation delay={0.1}>
          <div className="relative flex flex-col items-center overflow-hidden rounded-4xl bg-background-2 dark:bg-background-6 py-[90px] px-6">
            {/* Soft gradient background aus Code */}
            <div className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-secondary/15 dark:bg-background-4/60 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.18] dark:opacity-[0.22]">
              <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4)_0,_transparent_55%),radial-gradient(circle_at_bottom,_rgba(0,0,0,0.25)_0,_transparent_60%)]" />
            </div>

            {/* „Avatar“ + Label */}
            <div className="relative flex flex-col items-center justify-center space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent via-secondary to-background-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white ring-2 ring-white/80 dark:ring-background-8/80">
                PS
              </div>
              <figcaption className="text-tagline-2 font-medium dark:text-accent/90 text-secondary/90">
                Von unserem Gründerteam
              </figcaption>
            </div>

            {/* Zitat */}
            <p className="relative mx-auto mt-6 mb-4 max-w-[650px] text-center text-xl max-sm:text-tagline-2 max-sm:px-2 text-secondary/90 dark:text-accent/90">
              <span className="mr-1 align-top text-2xl text-accent/60">„</span>
              Pilar Systems ist aus der Frage entstanden: Warum fühlen sich so viele Studios an der Rezeption noch an
              wie 2005, obwohl auf der Trainingsfläche alles modern ist? Wir wollen die Lücke schließen – mit einer
              Infrastruktur, die Anfragen, Probetrainings und Mitgliederkommunikation endlich auf das Niveau bringt, das
              deine Mitglieder bereits von deinem Training gewohnt sind.
              <span className="ml-1 align-bottom text-2xl text-accent/60">“</span>
            </p>

            {/* Name / Rolle */}
            <div className="relative mt-2 flex flex-col items-center gap-1">
              <strong className="text-lg leading-[1.5] font-medium dark:text-accent text-secondary">
                Team Pilar Systems
              </strong>
              <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">
                KI-Infrastruktur für Fitnessstudios &amp; Coaches
              </p>
            </div>

            {/* Mini-Conversion-Hinweis */}
            <div className="relative mt-8 inline-flex items-center gap-2 rounded-full border border-stroke-2/70 bg-background-1/70 px-4 py-2 text-[11px] text-secondary/70 dark:border-stroke-6/70 dark:bg-background-8/80 dark:text-accent/75">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
              <span>
                Studios, die mit Pilar arbeiten, sehen oft schon nach wenigen Wochen klarere Prozesse und mehr
                erschienene Probetrainings.
              </span>
            </div>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default Reviews;
