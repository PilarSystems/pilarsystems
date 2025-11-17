import RevealAnimation from '../animation/RevealAnimation';

interface AffiliateStep {
  id: string;
  stepNumber: string;
  icon: string;
  title: string;
  description: string;
}

const affiliateStepsData: AffiliateStep[] = [
  {
    id: '1',
    stepNumber: 'Schritt 1',
    icon: 'ns-shape-35',
    title: 'Als Affiliate bewerben',
    description:
      'Du meldest dich über das Formular oder per Kontakt bei uns und erzählst kurz, wie du Studios, Gyms oder Coaches erreichst – z. B. Social Media, E-Mail-Liste, Netzwerk oder Ads.',
  },
  {
    id: '2',
    stepNumber: 'Schritt 2',
    icon: 'ns-shape-12',
    title: 'PILAR & Material kennenlernen',
    description:
      'Du bekommst von uns eine kurze Einführung in die wichtigsten Use Cases von PILAR SYSTEMS sowie Vorlagen, Hooks und Beispiele, wie du das Produkt positionieren kannst.',
  },
  {
    id: '3',
    stepNumber: 'Schritt 3',
    icon: 'ns-shape-3',
    title: 'Studios empfehlen & Provisionen aufbauen',
    description:
      'Du empfiehlst PILAR an passende Studios und Coaches. Für jedes gewonnene, aktive Studio erhältst du eine wiederkehrende Provision – wir tracken alles transparent über dein Partner-Setup.',
  },
];

const AffiliatesStep = () => {
  return (
    <div className="grid grid-cols-12 gap-8">
      {affiliateStepsData.map((step, index) => (
        <RevealAnimation key={step.id} delay={0.4 + index * 0.1}>
          <article className="space-y-3.5 p-8 col-span-12 md:col-span-6 lg:col-span-4 bg-white dark:bg-background-6 rounded-[20px]">
            <div className="space-y-11">
              <span className="text-tagline-2 inline-block dark:text-accent/60">{step.stepNumber}</span>
              <div>
                <span className={`${step.icon} text-[52px] text-secondary dark:text-accent`} />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-heading-6 md:text-heading-5">{step.title}</h3>
              <p className="max-w-[345px]">{step.description}</p>
            </div>
          </article>
        </RevealAnimation>
      ))}
    </div>
  );
};

AffiliatesStep.displayName = 'AffiliatesStep';
export default AffiliatesStep;
