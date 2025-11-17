import { ICaseStudy } from '@/interface';
import getMarkDownContent from '@/utils/getMarkDownContent';
import ReactMarkdown from 'react-markdown';
import RevealAnimation from '../animation/RevealAnimation';
import CaseStudyTestimonial from './CaseStudyTestimonial';

interface CaseStudyDetailsProps {
  slug?: string;
}

const CaseStudyDetails = ({ slug }: CaseStudyDetailsProps) => {
  // Fallback, falls aus irgendeinem Grund kein Slug übergeben wird
  if (!slug) {
    return (
      <section className="pt-7 pb-24 md:pb-28 lg:pb-32 xl:pb-[200px]">
        <div className="main-container">
          <div className="max-w-[700px] space-y-4">
            <RevealAnimation delay={0.2}>
              <h2 className="text-heading-3">Für diese Erfolgsgeschichte liegen aktuell keine Details vor.</h2>
            </RevealAnimation>
            <RevealAnimation delay={0.3}>
              <p className="text-tagline-1 text-secondary/80 dark:text-accent/80">
                Bitte gehe zurück zur Übersicht der Erfolgsgeschichten oder wähle eine andere Case Study aus. Falls der
                Fehler weiterhin auftritt, prüfe, ob die entsprechende Markdown-Datei im Ordner
                <code className="mx-1 rounded-md bg-background-1 px-1.5 py-0.5 text-[12px]">
                  src/data/case-study
                </code>
                vorhanden ist.
              </p>
            </RevealAnimation>
          </div>
        </div>
      </section>
    );
  }

  // @ts-expect-error - ICaseStudy ist nicht vollständig typisiert
  const caseStudy: ICaseStudy = getMarkDownContent('src/data/case-study/', slug);

  const title = caseStudy.data.title || 'Erfolgsgeschichte ohne Titel';

  return (
    <section className="pt-7 pb-24 md:pb-28 lg:pb-32 xl:pb-[200px]">
      <div className="main-container">
        <div className="space-y-[70px]">
          {/* Titel */}
          <RevealAnimation delay={0.2}>
            <h2 className="text-heading-3">{title}</h2>
          </RevealAnimation>

          {/* Code-Visual statt Thumbnail-Bild */}
          <RevealAnimation delay={0.3}>
            <div className="relative overflow-hidden rounded-4xl border border-stroke-2/70 dark:border-stroke-6/70 bg-gradient-to-br from-accent/12 via-background-1 to-background-3 dark:from-accent/20 dark:via-background-8 dark:to-background-9 px-6 md:px-8 py-7 md:py-8">
              {/* Glows */}
              <div className="pointer-events-none absolute -top-20 -left-16 h-40 w-40 rounded-full bg-accent/24 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-10 h-44 w-44 rounded-full bg-secondary/18 dark:bg-background-5/60 blur-3xl" />

              <div className="relative grid gap-6 md:grid-cols-[1.05fr_0.95fr] items-stretch">
                {/* Linke Seite: Kontext & Herausforderung */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/70">
                      Kontext der Implementierung
                    </p>
                    <p className="text-tagline-1 text-secondary/85 dark:text-accent/85">
                      Jedes Studio bringt eigene Prozesse, Teamgrößen und Marketingkanäle mit. Diese Case Study zeigt,
                      wie PILAR SYSTEMS in der Praxis hilft, Anfragen zu strukturieren, Probetrainings zu füllen und
                      klare Zahlen in den Alltag zu bringen.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/70">
                      Fokus in diesem Projekt
                    </p>
                    <ul className="space-y-1.5 text-tagline-1 text-secondary/85 dark:text-accent/85">
                      <li className="before:content-[''] before:inline-block before:mr-2 before:mt-[2px] before:size-1.5 before:rounded-full before:bg-secondary/70 dark:before:bg-accent/80 align-top">
                        Anfragen aus Telefon, WhatsApp und E-Mail zentral sichtbar machen.
                      </li>
                      <li className="before:content-[''] before:inline-block before:mr-2 before:mt-[2px] before:size-1.5 before:rounded-full before:bg-secondary/70 dark:before:bg-accent/80 align-top">
                        Probetrainings-Funnel klar definieren – von erster Anfrage bis Vertragsabschluss.
                      </li>
                      <li className="before:content-[''] before:inline-block before:mr-2 before:mt-[2px] before:size-1.5 before:rounded-full before:bg-secondary/70 dark:before:bg-accent/80 align-top">
                        Dem Team mehr Transparenz geben, welche Kampagnen wirklich Mitglieder bringen.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Rechte Seite: kompaktes „Ergebnis-Panel“ */}
                <div className="space-y-4 rounded-3xl bg-background-1/95 dark:bg-background-9/95 border border-stroke-2/70 dark:border-stroke-6/70 px-5 py-5 md:px-6 md:py-6">
                  <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/70 mb-1">
                    Projekt-Snapshot
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-tagline-1 text-secondary/85 dark:text-accent/85">
                      <span>Antwortzeit auf neue Anfragen</span>
                      <span className="font-medium text-emerald-400">
                        {caseStudy.data.after?.[0] ? 'verbessert' : 'deutlich reduziert'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-tagline-1 text-secondary/85 dark:text-accent/85">
                      <span>Erschienene Probetrainings</span>
                      <span className="font-medium text-emerald-400">
                        {caseStudy.data.after?.[1] ? 'klar erhöht' : '+ mehr Show-ups'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-tagline-1 text-secondary/85 dark:text-accent/85">
                      <span>Abschlüsse aus Leads</span>
                      <span className="font-medium text-emerald-400">
                        {caseStudy.data.after?.[2] ? 'stärker konvertiert' : '+ bessere Conversion'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-tagline-1 text-secondary/85 dark:text-accent/85">
                      <span>No-Show-Rate</span>
                      <span className="font-medium text-rose-300">
                        {caseStudy.data.after?.[3] ? 'gesenkt' : 'spürbar reduziert'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-dashed border-stroke-2/70 dark:border-stroke-6/70 space-y-1.5">
                    <p className="text-tagline-2 text-secondary/60 dark:text-accent/65">
                      Auf einen Blick
                    </p>
                    <p className="text-tagline-1 text-secondary/85 dark:text-accent/85">
                      Die Kombination aus KI-Inbox, Telefon-KI, Follow-ups und Reporting sorgt dafür, dass kein Lead
                      „durchrutscht“ – und das Studio deutlich besser steuern kann, was wirklich funktioniert.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </RevealAnimation>

          {/* Inhalt aus Markdown */}
          <div className="space-y-[72px] max-w-[950px] mx-auto case-study-details">
            <ReactMarkdown>
              {caseStudy.content || 'Für diese Erfolgsgeschichte liegt aktuell noch kein Inhalt vor.'}
            </ReactMarkdown>

            {/* Ergebnisse – strukturierte Tabelle */}
            <div>
              <RevealAnimation delay={0.4}>
                <h3 className="text-heading-4">Die Ergebnisse</h3>
              </RevealAnimation>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-3">
                {/* 1. Spalte: Kennzahlen */}
                <RevealAnimation delay={0.5}>
                  <div className="max-w-[306] [&>p]:border-b [&>p]:border-b-stroke-4 dark:[&>p]:border-b-stroke-7 [&>p]:last:border-b-0">
                    <p className="py-4 text-secondary dark:text-accent font-medium">Kennzahl</p>
                    <p className="py-4">Antwortzeit auf Anfragen</p>
                    <p className="py-4">Erschienene Probetrainings</p>
                    <p className="py-4">Abschlüsse aus Leads</p>
                    <p className="py-4">No-Show-Rate</p>
                  </div>
                </RevealAnimation>

                {/* 2. Spalte: Vorher */}
                <RevealAnimation delay={0.6}>
                  <div className="max-w-[306] text-center px-6 bg-white dark:bg-background-6 rounded-[20px] [&>p]:border-b [&>p]:border-b-stroke-4 dark:[&>p]:border-b-stroke-7 [&>p]:last:border-b-0">
                    <p className="py-4 text-secondary font-medium border-b dark:text-accent">Vorher</p>
                    {caseStudy.data.before?.map((item: string, index: number) => (
                      <p key={index} className="py-4 border-b last:border-b-0">
                        {item}
                      </p>
                    ))}
                  </div>
                </RevealAnimation>

                {/* 3. Spalte: Nachher */}
                <RevealAnimation delay={0.7}>
                  <div className="max-w-[306] text-center px-6 bg-white dark:bg-background-6 rounded-[20px] [&>p]:border-b [&>p]:border-b-stroke-4 dark:[&>p]:border-b-stroke-7 [&>p]:last:border-b-0">
                    <p className="py-4 text-secondary dark:text-accent font-medium">Nachher</p>
                    {caseStudy.data.after?.map((item: string, index: number) => (
                      <p key={index} className="py-4 border-b last:border-b-0">
                        {item}
                      </p>
                    ))}
                  </div>
                </RevealAnimation>
              </div>
            </div>

            {/* Testimonial */}
            <CaseStudyTestimonial userReview={caseStudy.data.userReview} />

            {/* Features / Module */}
            <RevealAnimation delay={0.2}>
              <div className="space-y-6">
                <h5 className="text-heading-4">Genutzte Module</h5>
                <ul className="space-y-2">
                  {caseStudy.data.keyFeatures?.map((feature: string, index: number) => (
                    <li key={index} className="text-secondary/60 dark:!text-accent/60">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyDetails;
