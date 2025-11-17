{
  /* =========================
   * Features – Pilar Systems
   * Übersicht aller Kernmodule (ohne Template-Bilder)
   ===========================*/
}

import RevealAnimation from '../animation/RevealAnimation';

type FeatureCard = {
  id: string;
  title: string;
  kicker: string;
  description: string;
  bullets: string[];
  badge: string;
};

const featureCards: FeatureCard[] = [
  {
    id: 'inbox',
    kicker: 'KI-Inbox für alle Kanäle',
    title: 'Telefon, WhatsApp, E-Mail & DMs in EINER Oberfläche.',
    description:
      'PILAR SYSTEMS bündelt alle Anfragen in einer KI-Inbox – inklusive Gesprächsverlauf, Notizen und Status. Kein Hin-und-Her mehr zwischen Telefonanlage, WhatsApp-Handy und E-Mail-Postfach.',
    bullets: [
      'Eingehende & verpasste Anrufe, WhatsApp, E-Mails & Website-Formulare zentral gesammelt.',
      'KI beantwortet Standardfragen und qualifiziert Interessenten automatisch vor.',
      'Alle Leads sauber dokumentiert – inklusive Tags, Quelle und „Nächster Schritt“.',
    ],
    badge: 'Core-Modul · Basic & Pro',
  },
  {
    id: 'phone',
    kicker: 'KI-Rezeption & Follow-up',
    title: 'Telefonanlage, Rückrufe & Probetrainings auf Autopilot.',
    description:
      'Deine KI nimmt Anrufe professionell an, ruft automatisiert zurück und führt Interessenten bis zum gebuchten Probetraining – ohne dass jemand im Büro sitzen muss.',
    bullets: [
      '24/7-Erreichbarkeit mit Studio-Branding statt Callcenter-Flair.',
      'Smartes Follow-up per WhatsApp, SMS oder E-Mail bis zum Termin.',
      'Dynamische Skripte für Angebote, Aktionen & Kampagnen.',
    ],
    badge: 'Voice · ab Pro',
  },
  {
    id: 'coach',
    kicker: 'KI-Coach über WhatsApp',
    title: 'Trainingspläne & Check-ins direkt im Chat – später in der App.',
    description:
      'Mit dem PILAR KI-Coach erhalten Mitglieder individuelle Trainingspläne, Check-ins und Motivation direkt über WhatsApp. Später kannst du das gleiche Erlebnis in deiner eigenen App ausspielen.',
    bullets: [
      'Fragen zu Zielen, Level & Equipment – daraus entsteht ein individueller Plan.',
      'Regelmäßige Check-ins, Anpassungen & Erinnerungen durch die KI.',
      'Später nahtlos erweiterbar auf eine eigene Mitglieder-App (PILAR OS).',
    ],
    badge: 'KI-Coach · Elite',
  },
  {
    id: 'calendar',
    kicker: 'Kalender & Studio-Workflows',
    title: 'Probetrainings, Verträge & PT-Sessions im synchronen Kalender.',
    description:
      'Alle Termine laufen in einen zentralen Kalender: Probetrainings, Vertragsabschlüsse, Kurse, 1:1-Coachings oder Telefon-Calls – inklusive automatischer Bestätigungen und Erinnerungen.',
    bullets: [
      'Synchroner Kalender für Team, Trainer & Empfang.',
      'Automatische Bestätigungs- und Erinnerungsnachrichten.',
      'No-Show-Handling & Wiedervorlagen für nicht erschienene Leads.',
    ],
    badge: 'Scheduling · Basic & Pro',
  },
  {
    id: 'analytics',
    kicker: 'Growth & Reporting',
    title: 'Growth-Analytics statt „blinder“ Studio-Software.',
    description:
      'PILAR SYSTEMS zeigt dir, welche Kampagnen funktionieren, wie viele Leads wirklich zu Verträgen werden und wo Kapazitäten frei sind – ohne Excel und ohne manuelle Listen.',
    bullets: [
      'Übersicht: Leads, Probetrainings, Abschlüsse, Kündigungen & aktive Verträge.',
      'Auswertungen pro Kanal (Telefon, WhatsApp, Kampagne, Empfehlung, …).',
      'Geplante Growth-Vorschläge direkt von der KI – für Aktionen & Füllung von schwachen Zeiten.',
    ],
    badge: 'Growth · ab Pro',
  },
];

const Features = () => {
  return (
    <section
      className="pb-[200px] pt-[100px] bg-background-3/50 dark:bg-background-7/60"
      aria-label="Funktionen von Pilar Systems"
    >
      <div className="main-container">
        <div className="space-y-[70px]">
          {/* Headline */}
          <div className="space-y-3 text-center">
            <RevealAnimation delay={0.3}>
              <h2 className="max-w-[814px] mx-auto">
                Alle Module, die dein Studio braucht – in einer Plattform.
              </h2>
            </RevealAnimation>
            <RevealAnimation delay={0.4}>
              <p className="max-w-[734px] mx-auto text-secondary/80 dark:text-accent/80">
                Statt fünf verschiedenen Tools für Telefon, WhatsApp, Trainingspläne, Kalender und Reporting
                bekommst du mit PILAR SYSTEMS eine durchdachte KI-Infrastruktur – modular buchbar als Basic,
                Pro oder Elite.
              </p>
            </RevealAnimation>
          </div>

          {/* Kleine Modul-Legende */}
          <RevealAnimation delay={0.45}>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[13px]">
              <span className="px-3 py-1 rounded-full border border-border/60 bg-background-1/70 dark:bg-background-8/70">
                Basic · KI-Inbox & Messaging
              </span>
              <span className="px-3 py-1 rounded-full border border-border/60 bg-background-1/70 dark:bg-background-8/70">
                Pro · Telefon, Kalender & Automationen
              </span>
              <span className="px-3 py-1 rounded-full border border-border/60 bg-background-1/70 dark:bg-background-8/70">
                Elite · KI-Coach, Growth & Multi-Location
              </span>
            </div>
          </RevealAnimation>

          {/* Feature Cards Grid – reine Code-Blöcke, keine Bilder */}
          <div className="flex flex-col gap-y-10">
            {/* Erste Reihe */}
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-y-8 sm:gap-x-8">
              {featureCards.slice(0, 3).map((card, index) => (
                <RevealAnimation key={card.id} delay={0.5 + index * 0.1}>
                  <article className="max-w-[409px] w-full rounded-3xl border border-border/60 bg-background-1/90 dark:bg-background-8/80 px-5 py-6 shadow-sm">
                    {/* Oberer Block mit Badge / Kicker */}
                    <div className="mb-4 flex flex-col gap-2">
                      <span className="inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r from-[rgba(123,212,255,0.12)] via-[rgba(92,178,255,0.08)] to-[rgba(60,130,255,0.12)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-secondary/70 dark:text-accent/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-[rgba(123,212,255,0.9)]" />
                        {card.badge}
                      </span>
                      <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/60">
                        {card.kicker}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="text-heading-5 leading-snug">{card.title}</h3>
                      <p className="text-secondary/80 dark:text-accent/80">{card.description}</p>
                      <ul className="mt-3 space-y-1.5 text-tagline-1 text-secondary/75 dark:text-accent/75 list-disc list-inside">
                        {card.bullets.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Unterer Meta-Bereich */}
                    <div className="mt-5 flex items-center justify-between text-[12px] text-secondary/60 dark:text-accent/60 border-t border-border/60 pt-3">
                      <span>PILAR · {card.id.toUpperCase()}</span>
                      <span>Infrastruktur statt Einzeltool</span>
                    </div>
                  </article>
                </RevealAnimation>
              ))}
            </div>

            {/* Zweite Reihe */}
            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-y-8 sm:gap-x-8">
              {featureCards.slice(3).map((card, index) => (
                <RevealAnimation key={card.id} delay={0.8 + index * 0.1}>
                  <article className="max-w-[409px] w-full rounded-3xl border border-border/60 bg-background-1/90 dark:bg-background-8/80 px-5 py-6 shadow-sm">
                    <div className="mb-4 flex flex-col gap-2">
                      <span className="inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r from-[rgba(123,212,255,0.12)] via-[rgba(92,178,255,0.08)] to-[rgba(60,130,255,0.12)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-secondary/70 dark:text-accent/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-[rgba(123,212,255,0.9)]" />
                        {card.badge}
                      </span>
                      <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/60">
                        {card.kicker}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-heading-5 leading-snug">{card.title}</h3>
                      <p className="text-secondary/80 dark:text-accent/80">{card.description}</p>
                      <ul className="mt-3 space-y-1.5 text-tagline-1 text-secondary/75 dark:text-accent/75 list-disc list-inside">
                        {card.bullets.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 flex items-center justify-between text-[12px] text-secondary/60 dark:text-accent/60 border-t border-border/60 pt-3">
                      <span>PILAR · {card.id.toUpperCase()}</span>
                      <span>Für Gyms & Studios gebaut</span>
                    </div>
                  </article>
                </RevealAnimation>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Features.displayName = 'Features';

export default Features;
