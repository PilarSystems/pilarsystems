import { ICaseStudy } from '@/interface';
import RevealAnimation from '../animation/RevealAnimation';

const CaseStudyTestimonial = ({ userReview }: { userReview: ICaseStudy['userReview'] }) => {
  const initials =
    userReview?.userName
      ?.split(' ')
      .map((part: string) => part.charAt(0))
      .join('')
      .slice(0, 2) || 'PS';

  return (
    <section>
      <div className="mx-auto max-w-[950px]">
        <div className="space-y-14">
          {/* Heading */}
          <div className="space-y-3">
            <RevealAnimation delay={0.1}>
              <h4 className="text-heading-2" id="testimonials-title">
                Was Studios über PILAR SYSTEMS sagen
              </h4>
            </RevealAnimation>
            <blockquote>
              <RevealAnimation delay={0.2}>
                <p>
                  &quot;PILAR hat unseren Alltag an der Theke komplett verändert – weniger Chaos in den Kanälen, mehr
                  strukturierte Leads und deutlich mehr Probetrainings, die wirklich erscheinen.&quot;
                </p>
              </RevealAnimation>
            </blockquote>
          </div>

          {/* Testimonial Card */}
          <RevealAnimation delay={0.3}>
            <div className="max-w-[950px] space-y-6 rounded-[20px] bg-secondary p-8 dark:bg-background-6 relative overflow-hidden">
              {/* weicher Gradient im Hintergrund */}
              <div className="pointer-events-none absolute -top-20 -right-10 h-40 w-40 rounded-full bg-accent/30 blur-3xl opacity-70" />
              <div className="pointer-events-none absolute -bottom-24 -left-12 h-44 w-44 rounded-full bg-background-1/40 blur-3xl opacity-70" />

              {/* „Avatar“ aus Initialen */}
              <figure className="relative flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent via-secondary to-background-1 text-sm font-medium uppercase tracking-[0.14em] text-white ring-2 ring-white/80 dark:ring-background-8/80">
                  {initials}
                </div>
                <figcaption className="text-tagline-2 font-medium text-accent/70">
                  Stimme aus einem PILAR Studio
                </figcaption>
              </figure>

              <blockquote>
                <p className="relative text-white/90 dark:text-accent/70">
                  {userReview?.reviewText ||
                    '„Mit PILAR haben wir zum ersten Mal wirklich Transparenz darüber, was mit unseren Leads passiert – und verschenken deutlich weniger Potenzial.“'}
                </p>
              </blockquote>

              <div className="relative pb-4">
                <p className="text-lg font-medium leading-[150%] text-white dark:text-accent">
                  {userReview?.userName || 'Studioleitung, anonymisiert'}
                </p>
                <p className="text-tagline-2 text-accent/60">
                  {userReview?.userRole || 'Betreiber:in eines Fitnessstudios mit PILAR SYSTEMS'}
                </p>
              </div>
            </div>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyTestimonial;
