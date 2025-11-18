import Marquee from 'react-fast-marquee';
import RevealAnimation from '../animation/RevealAnimation';

// Bewusst ohne echte Namen – nur Rollen & Szenarien
const testimonials = [
  {
    id: 1,
    quote:
      '„Seit wir PILAR nutzen, landen alle Anfragen aus Telefon, WhatsApp und E-Mail in einer Inbox – nichts geht mehr im Alltag unter.“',
    role: 'Studioleitung, 600+ Mitglieder',
    context: 'Pilotkunde Fitnessstudio',
  },
  {
    id: 2,
    quote:
      '„Probetrainings werden automatisch nachgefasst – wir haben deutlich mehr Termine, die wirklich wahrgenommen werden.“',
    role: 'Inhaber*in eines Gyms',
    context: 'Lead- & Probetraining-Funnel',
  },
  {
    id: 3,
    quote:
      '„Unser Team an der Theke ist merklich entlastet. Die KI beantwortet Standardfragen, wir kümmern uns um die Mitglieder auf der Fläche.“',
    role: 'Studioleitung, Premium-Club',
    context: 'Entlastung Rezeption',
  },
  {
    id: 4,
    quote:
      '„Durch die klaren Pipelines sehen wir auf einen Blick, welche Leads heiß sind und wo wir nachfassen müssen.“',
    role: 'Sales-Verantwortung im Studio',
    context: 'Lead-Pipeline & Übersicht',
  },
  {
    id: 5,
    quote:
      '„Das Onboarding über den Setup-Wizard war schnell erledigt – kein IT-Projekt, sondern ein klarer Prozess.“',
    role: 'Studioinhaber*in, Einzelstandort',
    context: 'Setup & Implementierung',
  },
];

const TestimonialMarquee = () => {
  return (
    <section className="lg:pt-[100px] pt-[50px] md:pt-[75px] ">
      <div className="main-container">
        <div className="mb-[70px]">
          {/* heading  */}
          <div className="max-w-[804px] md:w-full mx-auto text-center space-y-5">
            <RevealAnimation delay={0.1}>
              <span className="badge badge-cyan"> Stimmen & Erfahrungen </span>
            </RevealAnimation>
            <div className="space-y-3">
              <RevealAnimation delay={0.2}>
                <h2>Was Studios & Coaches über PILAR SYSTEMS sagen.</h2>
              </RevealAnimation>
              <RevealAnimation delay={0.3}>
                <p className="max-w-[600px] mx-auto">
                  Studios nutzen PILAR, um Anfragen, Probetrainings, Verträge und Mitgliederkommunikation zu
                  automatisieren – ohne zusätzliche Rezeption, ohne Agentur-Projekte. Hier ein Ausschnitt aus dem
                  Feedback der ersten Pilotkunden (anonymisiert).
                </p>
              </RevealAnimation>
            </div>
          </div>
        </div>
      </div>

      {/* review cards  */}
      <div className="lg:pb-[100px] pb-[50px] md:pb-[75px]">
        <RevealAnimation delay={0.7} instant>
          <div className="space-y-8">
            {/* testimonial left marquee  */}
            <div className="relative">
              <div className="from-background-3 dark:from-background-7 absolute top-0 left-0 z-40 h-full w-[15%] bg-gradient-to-r to-transparent md:w-[20%]" />
              <div className="from-background-3 dark:from-background-7 absolute top-0 right-0 z-40 h-full w-[15%] bg-gradient-to-l to-transparent md:w-[20%]" />

              <Marquee autoFill speed={40} pauseOnHover>
                <div className="flex items-center gap-8 overflow-hidden">
                  {testimonials.map((testimonial, index) => (
                    <RevealAnimation key={testimonial.id} delay={0.4 + index * 0.1}>
                      <div className="p-8 bg-background-2 dark:bg-background-6 rounded-[20px] w-[358px] first:ml-8">
                        <h3 className="text-tagline-1 text-wrap line-clamp-3">{testimonial.quote}</h3>
                        <div className="border-b border-stroke-4 dark:border-stroke-7 my-8" />
                        {/* avatar / Meta – ohne echte Namen */}
                        <div className="flex items-center gap-3">
                          <figure className="size-12 rounded-full overflow-hidden bg-gradient-to-br from-white via-accent/70 to-secondary/80 flex items-center justify-center text-[11px] font-semibold tracking-[0.16em] text-secondary ring-2 ring-white dark:ring-background-6">
                            PS
                          </figure>
                          <div>
                            <p className="text-secondary dark:text-accent">{testimonial.role}</p>
                            <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                              {testimonial.context}
                            </p>
                          </div>
                        </div>
                      </div>
                    </RevealAnimation>
                  ))}
                </div>
              </Marquee>
            </div>

            {/* testimonial right marquee  */}
            <div className="relative">
              <div className="from-background-3 dark:from-background-7 absolute top-0 left-0 z-40 h-full w-[15%] bg-gradient-to-r to-transparent md:w-[20%]" />
              <div className="from-background-3 dark:from-background-7 absolute top-0 right-0 z-40 h-full w-[15%] bg-gradient-to-l to-transparent md:w-[20%]" />
              <Marquee autoFill speed={40} direction="right" pauseOnHover>
                <div className="flex items-center gap-8 overflow-hidden">
                  {testimonials.map((testimonial, index) => (
                    <RevealAnimation key={`${testimonial.id}-right`} delay={0.4 + index * 0.1}>
                      <div className="p-8 bg-background-2 dark:bg-background-6 rounded-[20px] w-[358px] first:ml-8">
                        <h3 className="text-tagline-1 text-wrap line-clamp-3">{testimonial.quote}</h3>
                        <div className="border-b border-stroke-4 dark:border-stroke-7 my-8" />
                        <div className="flex items-center gap-3">
                          <figure className="size-12 rounded-full overflow-hidden bg-gradient-to-br from-white via-accent/70 to-secondary/80 flex items-center justify-center text-[11px] font-semibold tracking-[0.16em] text-secondary ring-2 ring-white dark:ring-background-6">
                            PS
                          </figure>
                          <div>
                            <p className="text-secondary dark:text-accent">{testimonial.role}</p>
                            <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                              {testimonial.context}
                            </p>
                          </div>
                        </div>
                      </div>
                    </RevealAnimation>
                  ))}
                </div>
              </Marquee>
            </div>

            {/* drittes Marquee */}
            <div className="relative">
              <div className="from-background-3 dark:from-background-7 absolute top-0 left-0 z-40 h-full w-[15%] bg-gradient-to-r to-transparent md:w-[20%]" />
              <div className="from-background-3 dark:from-background-7 absolute top-0 right-0 z-40 h-full w-[15%] bg-gradient-to-l to-transparent md:w-[20%]" />
              <Marquee autoFill speed={40} pauseOnHover>
                <div className="flex items-center gap-8 overflow-hidden">
                  {testimonials.map((testimonial, index) => (
                    <RevealAnimation key={`${testimonial.id}-bottom`} delay={0.4 + index * 0.1}>
                      <div className="p-8 bg-background-2 dark:bg-background-6 rounded-[20px] w-[358px] first:ml-8">
                        <h3 className="text-tagline-1 text-wrap line-clamp-3">{testimonial.quote}</h3>
                        <div className="border-b border-stroke-4 dark:border-stroke-7 my-8" />
                        <div className="flex items-center gap-3">
                          <figure className="size-12 rounded-full overflow-hidden bg-gradient-to-br from-white via-accent/70 to-secondary/80 flex items-center justify-center text-[11px] font-semibold tracking-[0.16em] text-secondary ring-2 ring-white dark:ring-background-6">
                            PS
                          </figure>
                          <div>
                            <p className="text-secondary dark:text-accent">{testimonial.role}</p>
                            <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                              {testimonial.context}
                            </p>
                          </div>
                        </div>
                      </div>
                    </RevealAnimation>
                  ))}
                </div>
              </Marquee>
            </div>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default TestimonialMarquee;
