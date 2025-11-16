'use client';

import { CheckIcon } from '@/icons';
import avatar9 from '@public/images/avatar/avatar-9.png';
import gradient12 from '@public/images/gradient/gradient-12.png';
import Image from 'next/image';
import NumberAnimation from '../animation/NumberAnimation';
import RevealAnimation from '../animation/RevealAnimation';
import Progress from '../homepage-04/Progress';
import LinkButton from '../ui/button/LinkButton';

const benefits = [
  {
    id: 1,
    text: 'Telefonanlage, WhatsApp, E-Mail & DMs in EINEM System – statt fünf verschiedenen Tools.',
  },
  {
    id: 2,
    text: 'KI qualifiziert Leads vor, schreibt nach und bucht Probetrainings automatisch in deinen Kalender.',
  },
  {
    id: 3,
    text: 'Trainingspläne, Mitgliederkommunikation & Growth-Analytics direkt im Dashboard – ohne Excel.',
  },
];

const Hero = () => {
  return (
    <section
      id="scene"
      className="
        relative z-0 overflow-hidden
        pt-24 md:pt-28 lg:pt-32
        pb-16 md:pb-20 lg:pb-24
        bg-gradient-to-b from-[#f5f7ff] via-white to-[#f5fbff]
        dark:from-background-5 dark:via-background-7 dark:to-background-8
      "
    >
      {/* dezente Gradients im Hintergrund */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-[20%] -top-[40%] w-[640px] opacity-60 blur-3xl dark:opacity-40">
          <Image src={gradient12} alt="Gradient" className="h-full w-full object-cover" />
        </div>
        <div className="absolute -left-[20%] bottom-[-30%] w-[520px] opacity-50 blur-3xl dark:opacity-30">
          <Image src={gradient12} alt="Gradient" className="h-full w-full rotate-180 object-cover" />
        </div>
      </div>

      <div className="main-container mx-auto max-w-[1120px]">
        <div className="grid min-h-[68vh] items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* LEFT – Text + Benefits + CTAs */}
          <div className="text-left">
            <RevealAnimation delay={0.15}>
              <p className="inline-flex items-center rounded-full border border-border/70 bg-white/70 px-3 py-1 text-[13px] font-medium uppercase tracking-[0.14em] text-secondary dark:bg-background-8/80 dark:text-accent">
                All-in-One KI-Infrastruktur für Gyms, Coaches & Studios
              </p>
            </RevealAnimation>

            <RevealAnimation delay={0.25}>
              <h1 className="mt-4 mb-4 max-w-[620px] leading-[1.05]">
                Die komplette KI-Plattform
                <br className="hidden md:block" />
                für dein Fitnessstudio.
              </h1>
            </RevealAnimation>

            <RevealAnimation delay={0.35}>
              <p className="mb-6 max-w-[560px] text-secondary/80 dark:text-accent/80">
                PILAR SYSTEMS ersetzt klassische Studio-Software, Callcenter und Excel-Listen.
                Telefonanlage, Messaging, Trainingspläne, Growth-Analytics und Support laufen
                in einer Plattform – modular buchbar als Basic, Pro oder Elite.
              </p>
            </RevealAnimation>

            <ul className="mb-8 flex flex-col gap-3">
              {benefits.map((item, idx) => (
                <RevealAnimation key={item.id} delay={0.45 + idx * 0.1}>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-[3px] flex size-[19px] shrink-0 items-center justify-center rounded-full bg-secondary dark:bg-accent/20">
                      <CheckIcon className="h-[18px] w-[18px] fill-white dark:fill-accent" />
                    </span>
                    <span className="text-tagline-2 text-secondary/90 dark:text-accent/80">
                      {item.text}
                    </span>
                  </li>
                </RevealAnimation>
              ))}
            </ul>

            <RevealAnimation delay={0.7}>
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
                <LinkButton
                  href="/signup-01"
                  className="btn btn-primary btn-xl w-full md:w-auto hover:btn-white dark:btn-accent dark:hover:btn-primary"
                  aria-label="Account erstellen und mit PILAR SYSTEMS starten"
                >
                  Jetzt PILAR testen
                </LinkButton>

                <LinkButton
                  href="#pricing"
                  className="btn btn-ghost btn-md text-secondary dark:text-accent hover:btn-secondary/10"
                  aria-label="Zu den Preisen und Plänen von PILAR SYSTEMS springen"
                >
                  Pläne vergleichen (Basic, Pro, Elite)
                </LinkButton>
              </div>
            </RevealAnimation>

            <RevealAnimation delay={0.85}>
              <div className="mt-5 flex items-center gap-3">
                <figure className="flex -space-x-2">
                  <Image
                    src={avatar9}
                    alt="Pilar Systems Kunde"
                    className="size-8 rounded-full border border-white bg-linear-[156deg,_#FFF_32.92%,_#C6F56F_91%]"
                  />
                  <div className="flex size-8 items-center justify-center rounded-full border border-white bg-secondary/10 text-xs text-secondary/70 dark:text-accent/80">
                    +240
                  </div>
                </figure>
                <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                  Studios & Teams testen bereits die PILAR Plattform – ohne Agenturprojekt, ohne lange Onboarding-Calls.
                </p>
              </div>
            </RevealAnimation>
          </div>

          {/* RIGHT – Dashboard Card mit einzeiligen Zahlen */}
          <RevealAnimation delay={0.4}>
            <div className="relative mx-auto w-full max-w-[480px] lg:translate-y-[-8px]">
              <div className="absolute -inset-6 rounded-[32px] bg-white/40 blur-3xl dark:bg-background-9/40" />

              <div className="relative rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.18)] dark:border-background-6 dark:bg-background-8/95">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">Heute im Studio</p>
                    <h3 className="text-heading-5 font-normal text-secondary dark:text-accent">
                      Live-Dashboard
                    </h3>
                  </div>
                  <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary dark:bg-accent/10 dark:text-accent">
                    Pilar OS
                  </span>
                </div>

                {/* Metrics Row */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2">
                  {/* Automatisierte Kontakte */}
                  <div className="flex flex-col gap-2 rounded-2xl bg-background-2 p-4 dark:bg-background-7">
                    <div>
                      <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                        Automatisierte Kontakte
                      </p>
                      <p className="mt-0.5 text-xs text-secondary/60 dark:text-accent/60">heute</p>
                    </div>
                    <p className="text-heading-5 font-normal text-secondary dark:text-accent">
                      <NumberAnimation
                        number={240}
                        speed={1400}
                        interval={160}
                        rooms={3}
                        heightSpaceRatio={2}
                      />
                      <span className="ml-1 text-tagline-2 text-secondary/80 dark:text-accent/80">Kontakte</span>
                    </p>
                    <div className="mt-1">
                      <Progress />
                    </div>
                  </div>

                  {/* Probetrainings */}
                  <div className="flex flex-col gap-2 rounded-2xl bg-background-1 p-4 dark:bg-background-6">
                    <div>
                      <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                        Gebuchte Probetrainings
                      </p>
                      <p className="mt-0.5 text-xs text-secondary/60 dark:text-accent/60">heute</p>
                    </div>
                    <p className="text-heading-5 font-normal text-secondary dark:text-accent">
                      <NumberAnimation
                        number={37}
                        speed={1400}
                        interval={180}
                        rooms={2}
                        heightSpaceRatio={2}
                      />
                      <span className="ml-1 text-tagline-2 text-secondary/80 dark:text-accent/80">Termine</span>
                    </p>
                    <p className="mt-0.5 text-tagline-2 text-emerald-600 dark:text-emerald-400">
                      +87% vs. letzter Monat
                    </p>
                  </div>
                </div>

                {/* Gesparte Zeit */}
                <div className="rounded-2xl bg-background-2/80 p-4 dark:bg-background-7/90">
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                        Gesparte Zeit im Team
                      </p>
                      <p className="mt-1 text-heading-5 font-normal text-secondary dark:text-accent">
                        <NumberAnimation
                          number={52}
                          speed={1400}
                          interval={160}
                          rooms={2}
                          heightSpaceRatio={2}
                        />
                        <span className="ml-1 text-tagline-2 text-secondary/80 dark:text-accent/80">
                          h&nbsp;/&nbsp;Monat
                        </span>
                      </p>
                    </div>
                    <div className="space-y-0.5 text-right text-tagline-2 text-secondary/70 dark:text-accent/70">
                      <p>Weniger Telefon</p>
                      <p>Mehr Betreuung auf der Fläche</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default Hero;
