{
  /* =========================
   Prozess-Schritte – PILAR SYSTEMS
   ===========================*/
}
import RevealAnimation from '../animation/RevealAnimation';

interface ProcessStepItem {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

const ProcessStep = () => {
  const processSteps: ProcessStepItem[] = [
    {
      id: 'plan-und-account',
      stepNumber: 'Schritt 1',
      title: 'Plan wählen & Account erstellen',
      description:
        'Du wählst deinen passenden PILAR Plan (Basic, Pro oder Elite), legst dein Studio an und erhältst sofort Zugang zur Plattform.',
      icon: 'ns-shape-36',
      features: [
        'Online-Registrierung in wenigen Minuten – komplett digital',
        'Keine Vor-Ort-Termine oder Agenturprojekte nötig',
        'Direkter Zugang zum Setup-Wizard nach dem Signup',
      ],
    },
    {
      id: 'setup-wizard',
      stepNumber: 'Schritt 2',
      title: 'Geführten Setup-Wizard durchlaufen',
      description:
        'Im Setup-Wizard beantwortest du gezielte Fragen zu deinem Studio, damit die KI versteht, wie ihr arbeitet und wie ihr kommuniziert.',
      icon: 'ns-shape-8',
      features: [
        'Standort, Öffnungszeiten & Kontaktwege hinterlegen',
        'Mitgliedsbeiträge, Tarife & Angebote definieren',
        'Tonalität und Brand-Vorgaben für die Kommunikation festlegen',
      ],
    },
    {
      id: 'kanaele-verbinden',
      stepNumber: 'Schritt 3',
      title: 'Kanäle verbinden & testen',
      description:
        'Jetzt werden deine bestehenden Systeme angebunden – und wir testen typische Szenarien aus Sicht deiner Interessenten einmal durch.',
      icon: 'ns-shape-2',
      features: [
        'Telefonanlage, WhatsApp & E-Mail-Postfach verknüpfen',
        'Kalender für Probetrainings & Beratungstermine verbinden',
        'Testläufe für Anrufe, Nachrichten & Formulare durchführen',
      ],
    },
    {
      id: 'regeln-und-funnel',
      stepNumber: 'Schritt 4',
      title: 'Regeln, Funnel & Angebote definieren',
      description:
        'Du legst fest, welche Leads priorisiert werden, wie Probetrainings vergeben werden und welche Angebote kommuniziert werden dürfen.',
      icon: 'ns-shape-19',
      features: [
        'Lead-Prioritäten & Status-Pipelines einrichten',
        'Automatische Follow-ups & Erinnerungen konfigurieren',
        'Angebote, Aktionen & Upsells als Playbooks hinterlegen',
      ],
    },
    {
      id: 'live-und-optimierung',
      stepNumber: 'Schritt 5',
      title: 'Live gehen & kontinuierlich optimieren',
      description:
        'Sobald alles sitzt, geht PILAR SYSTEMS live. Deine KI übernimmt den Alltag – und du optimierst auf Basis echter Daten und Auslastung.',
      icon: 'ns-shape-41',
      features: [
        'Live-Übersicht über Leads, Termine & Abschlüsse im Dashboard',
        'Auswertungen zu Kanälen, Kampagnen & Show-up-Rate',
        'Laufende Anpassung von Regeln, Automationen & Modulen (z. B. KI-Coach, weitere Standorte)',
      ],
    },
  ];

  return (
    <section className="py-[100px]">
      <div className="main-container">
        <div className="text-center space-y-3 mb-[72px]">
          <RevealAnimation delay={0.3}>
            <h2 className="max-w-[552px] mx-auto">
              Von der Planwahl zur laufenden KI-Infrastruktur – in wenigen Schritten.
            </h2>
          </RevealAnimation>
          <RevealAnimation delay={0.4}>
            <p className="max-w-[692px] mx-auto">
              Der Ablauf ist bewusst schlank gehalten: Dein Studio startet komplett digital, ohne lange Onboarding-Calls
              und ohne komplexe IT-Projekte – mit voller Kontrolle über Regeln, Angebote und Kommunikation.
            </p>
          </RevealAnimation>
        </div>

        <div className="grid grid-cols-12 md:gap-8 gap-y-5">
          {processSteps.map((step, index) => {
            const isBottomRow = index >= 3;
            const colClass =
              isBottomRow && index === 3
                ? 'col-span-12 md:col-span-6 lg:col-span-4 lg:col-start-3'
                : 'col-span-12 md:col-span-6 lg:col-span-4';

            return (
              <div key={step.id} className={colClass}>
                <RevealAnimation delay={0.3 + index * 0.1}>
                  <div className="sm:p-8 p-5 bg-background-1 dark:bg-background-6 rounded-[20px] space-y-8 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                      <p className="text-tagline-2 text-secondary dark:text-accent">{step.stepNumber}</p>
                      <span className={`${step.icon} text-[52px] text-secondary dark:text-accent`} />
                    </div>
                    <div className="space-y-4 flex-1">
                      <h3 className="sm:text-heading-5 text-heading-6 font-normal">{step.title}</h3>
                      <p>{step.description}</p>
                      <ul className="text-tagline-1 font-normal text-secondary/60 space-y-2 list-disc list-inside dark:text-accent/60">
                        {step.features.map((feature, featureIndex) => (
                          <li key={featureIndex}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </RevealAnimation>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessStep;
