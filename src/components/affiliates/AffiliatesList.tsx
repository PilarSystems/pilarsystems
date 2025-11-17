import RevealAnimation from '../animation/RevealAnimation';

interface AffiliateSection {
  id: string;
  title: string;
  description: string;
  items: string[];
}

const affiliateSectionsData: AffiliateSection[] = [
  {
    id: '1',
    title: 'Vorteile als PILAR Affiliate',
    description:
      'Als Affiliate-Partner von PILAR SYSTEMS profitierst du von einem klaren B2B-Produkt mit wiederkehrenden Umsätzen. Du empfiehlst eine Lösung, die Studios wirklich hilft – und wirst dafür nachhaltig beteiligt.',
    items: [
      'Wiederkehrende Provision pro aktivem Studio (Details individuell vereinbar)',
      'High-Ticket-Potenzial durch Setup-Gebühr und Pro-/Elite-Pläne',
      'Vorbereitete Landingpages, Texte und Visuals für deine Kanäle',
      'Persönlicher Ansprechpartner für Fragen und Optimierung',
      'Transparentes Tracking deiner Empfehlungen',
      'Regelmäßige Updates zu neuen Modulen & Verkaufsargumenten',
      'Gemeinsame Aktionen und Kampagnen für deine Zielgruppe möglich',
    ],
  },
  {
    id: '2',
    title: 'Für wen das Programm ideal ist',
    description:
      'Unser Affiliate-Programm ist für alle spannend, die Zugang zu Studios, Coaches oder Fitness-Communities haben – online oder offline – und langfristig ein skalierbares Zusatzeinkommen aufbauen möchten.',
    items: [
      'Agenturen, die bereits mit Fitnessstudios oder Coaches arbeiten',
      'Content-Creator im Fitness-, Business- oder Marketingbereich',
      'Sales-/BDR-Profile mit Netzwerk in der Fitnessbranche',
      'Performance-Marketer mit Erfahrung in Leads & Funnels',
    ],
  },
  {
    id: '3',
    title: 'Was nicht erlaubt ist',
    description:
      'Damit die Marke PILAR SYSTEMS sauber positioniert bleibt und wir alle langfristig profitieren, gelten für das Affiliate-Programm klare Spielregeln.',
    items: [
      'Kein Spam in Gruppen, DMs oder irrelevanten Communities',
      'Keine irreführenden oder falschen Versprechen („Garantie“, unrealistische Zahlen, etc.)',
      'Keine Nutzung von geschützten Marken oder Namen in Anzeigen, wo dies untersagt ist',
      'Keine Listung auf reinen Gutschein-/Coupon-Seiten ohne vorherige Absprache',
      'Keine Bewerbung gemeinsam mit direkten Wettbewerbern in derselben Kampagne',
    ],
  },
];

const AffiliatesList = () => {
  return (
    <article className="pt-14 md:pt-16 lg:pt-[88px] xl:pt-[100px] space-y-10 md:space-y-[70px]">
      {affiliateSectionsData.map((section, index) => (
        <RevealAnimation key={section.id} delay={0.1 + index * 0.1}>
          <div>
            <h3 className="text-heading-6 md:text-heading-5 font-normal mb-3">{section.title}</h3>
            <p className="mb-8 text-tagline-1 text-secondary/80 dark:text-accent/80">{section.description}</p>
            <ul className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className={`text-tagline-1 text-secondary/60 dark:text-accent/60 before:relative before:w-5 before:h-5 before:mr-3 before:left-0 before:content-[url('/images/icons/checkmark-white.svg')] dark:before:content-[url('/images/icons/checkmark-white.svg')] before:max-md:top-0 before:md:top-1${
                    itemIndex === 0 ? ' before:inline-block' : ''
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </RevealAnimation>
      ))}
    </article>
  );
};

AffiliatesList.displayName = 'AffiliatesList';
export default AffiliatesList;
