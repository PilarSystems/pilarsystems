import cardOneImgDark from '@public/images/home-page-9/feature-card-img-01-dark.png';
import cardOneImg from '@public/images/home-page-9/feature-card-img-01.png';
import cardTwoImgDark from '@public/images/home-page-9/feature-card-img-02-dark.png';
import cardTwoImg from '@public/images/home-page-9/feature-card-img-02.png';
import cardThreeImgDark from '@public/images/home-page-9/feature-card-img-03-dark.png';
import cardThreeImg from '@public/images/home-page-9/feature-card-img-03.png';
import cardFourImgDark from '@public/images/home-page-9/feature-card-img-04-dark.png';
import cardFourImg from '@public/images/home-page-9/feature-card-img-04.png';
import cardFiveImgDark from '@public/images/home-page-9/feature-card-img-05-dark.png';
import cardFiveImg from '@public/images/home-page-9/feature-card-img-05.png';
import Image from 'next/image';
import RevealAnimation from '../animation/RevealAnimation';

const Features = () => {
  return (
    <section className="pb-[200px] pt-[100px]" aria-label="Pilar Systems Funktionen">
      <div className="main-container">
        <div className="space-y-[70px]">
          {/* Heading */}
          <div className="space-y-3 text-center">
            <RevealAnimation delay={0.3}>
              <h2 className="max-w-[814px] mx-auto">
                Die komplette KI-Infrastruktur für moderne Fitnessstudios.
              </h2>
            </RevealAnimation>
            <RevealAnimation delay={0.4}>
              <p className="max-w-[734px] mx-auto">
                Pilar Systems bündelt Telefon, WhatsApp, E-Mail, Terminbuchung, Trainingspläne, Coach und
                Growth-Analytics in einer Plattform. Statt fünf Einzellösungen hast du ein System, das deinen Studioalltag
                wirklich versteht.
              </p>
            </RevealAnimation>
          </div>

          {/* 1. Zeile – Kommunikations- & Terminmodule */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-y-8 sm:gap-x-8">
            {/* Karte 1 – Omni-Channel KI-Inbox */}
            <RevealAnimation delay={0.5}>
              <div className="space-y-3">
                <div className="max-w-[409px] w-full rounded-[20px] bg-white dark:bg-background-5 p-2.5">
                  <figure className="overflow-hidden p-4 bg-background-3 dark:bg-background-7 rounded-2xl">
                    <Image
                      src={cardOneImg}
                      alt="Omni-Channel KI-Inbox für WhatsApp, E-Mail und Website"
                      className="w-full h-full object-cover dark:hidden"
                      loading="lazy"
                    />
                    <Image
                      src={cardOneImgDark}
                      alt="Omni-Channel KI-Inbox für WhatsApp, E-Mail und Website"
                      className="w-full h-full object-cover hidden dark:block"
                      loading="lazy"
                    />
                  </figure>
                </div>
                <div className="space-y-1">
                  <h3 className="text-heading-5">Omni-Channel KI-Inbox</h3>
                  <p>
                    Eine Inbox für WhatsApp, E-Mail und Website-Anfragen: Deine KI beantwortet Fragen, qualifiziert
                    Leads vor und begleitet sie bis zum gebuchten Probetraining – immer in deinem Studio-Branding.
                  </p>
                </div>
              </div>
            </RevealAnimation>

            {/* Karte 2 – KI-Telefonanlage */}
            <RevealAnimation delay={0.6}>
              <div className="space-y-3">
                <div className="max-w-[409px] w-full rounded-[20px] bg-white dark:bg-background-5 p-2.5">
                  <figure className="overflow-hidden p-4 bg-background-3 dark:bg-background-7 rounded-2xl">
                    <Image
                      src={cardTwoImg}
                      alt="KI-Telefonanlage für eingehende und verpasste Anrufe"
                      className="w-full h-full object-cover dark:hidden"
                      loading="lazy"
                    />
                    <Image
                      src={cardTwoImgDark}
                      alt="KI-Telefonanlage für eingehende und verpasste Anrufe"
                      className="w-full h-full object-cover hidden dark:block"
                      loading="lazy"
                    />
                  </figure>
                </div>
                <div className="space-y-1">
                  <h3 className="text-heading-5">24/7 KI-Telefonanlage</h3>
                  <p>
                    Deine KI geht ans Telefon, übernimmt Rückrufe bei verpassten Anrufen und sammelt alle relevanten
                    Infos – von Probetrainingswunsch bis Vertragsinteresse. Kein Klingeln ins Leere mehr.
                  </p>
                </div>
              </div>
            </RevealAnimation>

            {/* Karte 3 – Kalender & Funnel */}
            <RevealAnimation delay={0.7}>
              <div className="space-y-3">
                <div className="max-w-[409px] w-full rounded-[20px] bg-white dark:bg-background-5 p-2.5">
                  <figure className="overflow-hidden p-4 bg-background-3 dark:bg-background-7 rounded-2xl">
                    <Image
                      src={cardThreeImg}
                      alt="Kalender und Termin-Funnel für Probetrainings und Verträge"
                      className="w-full h-full object-cover dark:hidden"
                      loading="lazy"
                    />
                    <Image
                      src={cardThreeImgDark}
                      alt="Kalender und Termin-Funnel für Probetrainings und Verträge"
                      className="w-full h-full object-cover hidden dark:block"
                      loading="lazy"
                    />
                  </figure>
                </div>
                <div className="space-y-1">
                  <h3 className="text-heading-5">Kalender &amp; Termin-Funnel</h3>
                  <p>
                    Probetrainings, Beratungstermine und Vertragsabschlüsse werden direkt in deinen Kalender gebucht.
                    Mit klaren Pipelines siehst du jederzeit, welcher Lead in welcher Phase steckt.
                  </p>
                </div>
              </div>
            </RevealAnimation>
          </div>

          {/* 2. Zeile – Coach & Growth-Module */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-y-8 sm:gap-x-8">
            {/* Karte 4 – Coach & Trainingspläne */}
            <RevealAnimation delay={0.8}>
              <div className="space-y-3">
                <div className="max-w-[409px] w-full rounded-[20px] bg-white dark:bg-background-5 p-2.5">
                  <figure className="overflow-hidden p-4 bg-background-3 dark:bg-background-7 rounded-2xl">
                    <Image
                      src={cardFourImg}
                      alt="KI-Coach für Trainingspläne und Mitglieder-Check-ins"
                      className="w-full h-full object-cover dark:hidden"
                      loading="lazy"
                    />
                    <Image
                      src={cardFourImgDark}
                      alt="KI-Coach für Trainingspläne und Mitglieder-Check-ins"
                      className="w-full h-full object-cover hidden dark:block"
                      loading="lazy"
                    />
                  </figure>
                </div>
                <div className="space-y-1">
                  <h3 className="text-heading-5">KI-Coach &amp; Trainingspläne</h3>
                  <p>
                    Erstelle individuelle Trainingspläne, halte Mitglieder mit automatischen Check-ins accountable und
                    dokumentiere Fortschritte direkt im System – ohne Excel und Zettelwirtschaft.
                  </p>
                </div>
              </div>
            </RevealAnimation>

            {/* Karte 5 – Growth & Automationen */}
            <RevealAnimation delay={0.9}>
              <div className="space-y-3">
                <div className="max-w-[409px] w-full rounded-[20px] bg-white dark:bg-background-5 p-2.5">
                  <figure className="overflow-hidden p-4 bg-background-3 dark:bg-background-7 rounded-2xl">
                    <Image
                      src={cardFiveImg}
                      alt="Growth Analytics und Automationen für Fitnessstudios"
                      className="w-full h-full object-cover dark:hidden"
                      loading="lazy"
                    />
                    <Image
                      src={cardFiveImgDark}
                      alt="Growth Analytics und Automationen für Fitnessstudios"
                      className="w-full h-full object-cover hidden dark:block"
                      loading="lazy"
                    />
                  </figure>
                </div>
                <div className="space-y-1">
                  <h3 className="text-heading-5">Growth-Analytics &amp; Automationen</h3>
                  <p>
                    Sieh auf einen Blick, welche Kampagnen funktionieren, welche Kanäle Leads bringen und wo Potenzial
                    verschenkt wird. Automationen kümmern sich um Follow-ups, Reaktivierungen und No-Show-Nachfass.
                  </p>
                </div>
              </div>
            </RevealAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

Features.displayName = 'Features';

export default Features;
