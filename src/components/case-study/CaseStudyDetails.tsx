import { ICaseStudy } from '@/interface';
import getMarkDownContent from '@/utils/getMarkDownContent';
import Image from 'next/image';
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
              <h2 className="text-heading-3">
                Für diese Erfolgsgeschichte liegen aktuell keine Details vor.
              </h2>
            </RevealAnimation>
            <RevealAnimation delay={0.3}>
              <p className="text-tagline-1 text-secondary/80 dark:text-accent/80">
                Bitte gehe zurück zur Übersicht der Erfolgsgeschichten oder wähle eine andere Case Study aus. 
                Falls der Fehler weiterhin auftritt, prüfe, ob die entsprechende Markdown-Datei im Ordner 
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

  return (
    <section className="pt-7 pb-24 md:pb-28 lg:pb-32 xl:pb-[200px]">
      <div className="main-container">
        <div className="space-y-[70px]">
          <RevealAnimation delay={0.2}>
            <h2 className="text-heading-3 ">
              {caseStudy.data.title || 'Erfolgsgeschichte ohne Titel'}
            </h2>
          </RevealAnimation>

          <RevealAnimation delay={0.3}>
            <figure className="max-w-[1290px] max-h-[700px] overflow-hidden rounded-4xl">
              <Image
                src={caseStudy.data.thumbnail}
                alt="Detailansicht einer PILAR SYSTEMS Implementierung im Studio"
                width={1290}
                height={800}
                className="size-full object-cover"
              />
            </figure>
          </RevealAnimation>

          <div className="space-y-[72px] max-w-[950px] mx-auto case-study-details">
            <ReactMarkdown>
              {caseStudy.content || 'Für diese Erfolgsgeschichte liegt aktuell noch kein Inhalt vor.'}
            </ReactMarkdown>

            {/* Ergebnisse */}
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
                  <div className="max-w-[306] text-center px-6 [&>p]:border-b [&>p]:border-b-stroke-4 dark:[&>p]:border-b-stroke-7 [&>p]:last:border-b-0 bg-white dark:bg-background-6 rounded-[20px]">
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

            {/* Features */}
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
