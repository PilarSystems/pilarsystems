import { ICaseStudy } from '@/interface';
import getMarkDownData from '@/utils/getMarkDownData';
import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';

const Projects = () => {
  const featuredProjects: ICaseStudy[] = getMarkDownData('src/data/case-study').slice(0, 4);

  const renderCardVisual = (project: ICaseStudy) => {
    const initials =
      project?.title
        ?.split(' ')
        .map((p) => p.charAt(0))
        .join('')
        .slice(0, 3) || 'PS';

    return (
      <div className="relative w-full h-[300px] lg:h-[576px] rounded-[20px] overflow-hidden group cursor-pointer bg-gradient-to-br from-accent/22 via-background-1 to-background-3 dark:from-accent/28 dark:via-background-8 dark:to-background-9">
        {/* weiche Overlays wie vorher beim Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all duration-500 ease-in-out" />

        {/* „Thumbnail“-Look über reine CSS-Grafik */}
        <div className="absolute inset-0 px-6 py-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3 text-[11px] text-white/80">
            <span className="rounded-full bg-white/10 px-3 py-1 uppercase tracking-[0.16em]">
              Erfolgsgeschichte
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1">
              {project.result || 'Mehr Probetrainings & Abschlüsse'}
            </span>
          </div>

          <div className="flex flex-col gap-3 max-w-[80%]">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/90 text-xs font-semibold tracking-[0.18em] text-secondary">
                {initials}
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-white/70">Case Study</p>
                <h3 className="text-base sm:text-lg font-medium text-white line-clamp-2">
                  {project.title}
                </h3>
              </div>
            </div>
            <p className="text-[12px] text-white/70 line-clamp-2">{project.description}</p>
          </div>
        </div>

        {/* CTA-Button (Overlay) */}
        <LinkButton
          href={`/case-study/${project.slug}`}
          className="group-hover:opacity-100 group-hover:scale-110 group-hover:-translate-y-1/2 opacity-0 scale-95 -translate-y-[calc(50%-8px)] transition-all duration-500 ease-out absolute top-1/2 left-1/2 -translate-x-1/2 btn btn-md hover:btn-primary dark:btn-accent btn-secondary transform-gpu"
        >
          Case ansehen
        </LinkButton>
      </div>
    );
  };

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
                Sieh dir an, wie Fitness- & Gesundheitsstudios mit PILAR mehr Probetrainings, höhere Abschlussquoten und
                weniger Verwaltungsaufwand erreichen. Jede Case Study zeigt echte Abläufe – von der ersten Anfrage bis
                zum aktiven Mitglied.
              </p>
            </RevealAnimation>
          </div>
        </div>

        {/* Case Grid */}
        <div className="mb-14">
          <div className="grid grid-cols-12 gap-y-14 lg:gap-x-14">
            {/* Big Case */}
            <RevealAnimation delay={0.5}>
              <div className="col-span-12">
                <figure className="space-y-6">
                  {renderCardVisual(featuredProjects[0])}
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 md:justify-between">
                    <h3 className="text-heading-6 sm:text-heading-5">{featuredProjects[0].title}</h3>
                    <p className="max-w-[257px] text-left md:text-right line-clamp-2">
                      {featuredProjects[0].description}
                    </p>
                  </div>
                </figure>
              </div>
            </RevealAnimation>

            {/* Case 2 */}
            <RevealAnimation delay={0.6}>
              <div className="col-span-12 lg:col-span-6">
                <figure className="space-y-6">
                  {renderCardVisual(featuredProjects[1])}
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 md:justify-between">
                    <h3 className="text-heading-6 sm:text-heading-5">{featuredProjects[1].title}</h3>
                    <p className="max-w-[257px] text-left md:text-right line-clamp-2">
                      {featuredProjects[1].description}
                    </p>
                  </div>
                </figure>
              </div>
            </RevealAnimation>

            {/* Case 3 */}
            <RevealAnimation delay={0.7}>
              <div className="col-span-12 lg:col-span-6">
                <figure className="space-y-6">
                  {renderCardVisual(featuredProjects[2])}
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 md:justify-between">
                    <h3 className="text-heading-6 sm:text-heading-5">{featuredProjects[2].title}</h3>
                    <p className="max-w-[257px] text-left md:text-right line-clamp-2">
                      {featuredProjects[2].description}
                    </p>
                  </div>
                </figure>
              </div>
            </RevealAnimation>

            {/* Case 4 */}
            <RevealAnimation delay={0.8}>
              <div className="col-span-12">
                <figure className="space-y-6">
                  {renderCardVisual(featuredProjects[3])}
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 md:justify-between">
                    <h3 className="text-heading-6 sm:text-heading-5">{featuredProjects[3].title}</h3>
                    <p className="max-w-[257px] text-left md:text-right line-clamp-2">
                      {featuredProjects[3].description}
                    </p>
                  </div>
                </figure>
              </div>
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
