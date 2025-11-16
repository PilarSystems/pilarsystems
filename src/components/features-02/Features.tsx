{
  /* =========================
   * Features – Pilar Systems
   * Übersicht aller Kernmodule
   ===========================*/
}
import inboxImgLight from '@public/images/home-page-9/feature-card-img-01.png';
import inboxImgDark from '@public/images/home-page-9/feature-card-img-01-dark.png';
import phoneImgLight from '@public/images/home-page-9/feature-card-img-02.png';
import phoneImgDark from '@public/images/home-page-9/feature-card-img-02-dark.png';
import coachImgLight from '@public/images/home-page-9/feature-card-img-03.png';
import coachImgDark from '@public/images/home-page-9/feature-card-img-03-dark.png';
import calendarImgLight from '@public/images/home-page-9/feature-card-img-04.png';
import calendarImgDark from '@public/images/home-page-9/feature-card-img-04-dark.png';
import analyticsImgLight from '@public/images/home-page-9/feature-card-img-05.png';
import analyticsImgDark from '@public/images/home-page-9/feature-card-img-05-dark.png';

import Image from 'next/image';
import RevealAnimation from '../animation/RevealAnimation';

type FeatureCard = {
  id: string;
  title: string;
  kicker: string;
  description: string;
  bullets: string[];
  imgLight: any;
  imgDark: any;
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
      'Alle Leads sauber dokumentiert – inklusive Tags, Quelle und Nächster-Schritt.',
    ],
    imgLight: inboxImgLight,
    imgDark: inboxImgDark,
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
    imgLight: phoneImgLight,
    imgDark: phoneImgDark,
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
    imgLight: coachImgLight,
    imgDark: coachImgDark,
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
    imgLight: calendarImgLight,
    imgDark: calendarImgDark,
  },
  {
    id: 'analytics',
    kicker: 'Growth & Reporting',
    title: 'Growth-Analytics statt „blinder“ Studio-Software.',
    description:
      'PILAR SYSTEMS zeigt dir, welche Kampagnen funktionieren, wie viele Leads wirklich zu Verträgen werden und wo Kapazitäten frei sind. Ohne Excel, ohne manuelle Listen.',
    bullets: [
      'Übersicht: Leads, Probetrainings, Abschlüsse, Kündigungen & aktive Verträge.',
      'Auswertungen pro Kanal (Telefon, WhatsApp, Kampagne, Empfehlung, …).',
      'Geplante Growth-Vorschläge direkt von der KI – für Aktionen & Füllung von schwachen Zeiten.',
    ],
    imgLight: analyticsImgLight,
    imgDark: analyticsImgDark,
  },
];

const Features = () => {
  return (
    <section className="pb-[200px] pt-[100px]" aria-label="Funktionen von Pilar Systems">
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
              <p className="max-w-[734px] mx-auto">
                Statt fünf verschiedenen Tools für Telefon, WhatsApp, Trainingspläne, Kalender und Reporting
                bekommst du mit PILAR SYSTEMS eine durchdachte KI-Infrastruktur – modular buchbar als Basic,
                Pro oder Elite.
              </p>
            </RevealAnimation>
          </div>

          {/* Feature Cards Grid */}
          <div className="flex flex-col gap-y-10">
            {/* Erste Reihe */}
            <div className="flex flex-col sm:flex-row items-start justify-center gap-y-8 sm:gap-x-8">
              {featureCards.slice(0, 3).map((card, index) => (
                <RevealAnimation key={card.id} delay={0.5 + index * 0.1}>
                  <article className="space-y-3 max-w-[409px] w-full">
                    {/* Bild */}
                    <div className="w-full rounded-[20px] bg-white dark:bg-background-5 p-2.5">
                      <figure className="overflow-hidden p-4 bg-background-3 dark:bg-background-7 rounded-2xl">
                        <Image
                          src={card.imgLight}
                          alt={card.title}
                          className="w-full h-full object-cover dark:hidden"
                          loading="lazy"
                        />
                        <Image
                          src={card.imgDark}
                          alt={card.title}
                          className="w-full h-full object-cover hidden dark:block"
                          loading="lazy"
                        />
                      </figure>
                    </div>
                    {/* Content */}
                    <div className="space-y-2">
                      <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/60">
                        {card.kicker}
                      </p>
                      <h3 className="text-heading-5">{card.title}</h3>
                      <p className="text-secondary/80 dark:text-accent/80">{card.description}</p>
                      <ul className="mt-2 space-y-1.5 text-tagline-1 text-secondary/70 dark:text-accent/70 list-disc list-inside">
                        {card.bullets.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </RevealAnimation>
              ))}
            </div>

            {/* Zweite Reihe */}
            <div className="flex flex-col sm:flex-row items-start justify-center gap-y-8 sm:gap-x-8">
              {featureCards.slice(3).map((card, index) => (
                <RevealAnimation key={card.id} delay={0.8 + index * 0.1}>
                  <article className="space-y-3 max-w-[409px] w-full">
                    <div className="w-full rounded-[20px] bg-white dark:bg-background-5 p-2.5">
                      <figure className="overflow-hidden p-4 bg-background-3 dark:bg-background-7 rounded-2xl">
                        <Image
                          src={card.imgLight}
                          alt={card.title}
                          className="w-full h-full object-cover dark:hidden"
                          loading="lazy"
                        />
                        <Image
                          src={card.imgDark}
                          alt={card.title}
                          className="w-full h-full object-cover hidden dark:block"
                          loading="lazy"
                        />
                      </figure>
                    </div>
                    <div className="space-y-2">
                      <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/60">
                        {card.kicker}
                      </p>
                      <h3 className="text-heading-5">{card.title}</h3>
                      <p className="text-secondary/80 dark:text-accent/80">{card.description}</p>
                      <ul className="mt-2 space-y-1.5 text-tagline-1 text-secondary/70 dark:text-accent/70 list-disc list-inside">
                        {card.bullets.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
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
