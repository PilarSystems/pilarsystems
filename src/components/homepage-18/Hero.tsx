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
    text: 'Alle Anfragen aus Telefon, WhatsApp, E-Mail & DMs in einer KI-Inbox.',
  },
  {
    id: 2,
    text: 'Automatisches Follow-up bis zum gebuchten Probetraining oder Vertragsabschluss.',
  },
  {
    id: 3,
    text: 'Trainingspläne, Terminplanung & Mitgliederkommunikation in einem Dashboard.',
  },
];

const Hero = () => {
  return (
    <section
      id="scene"
      className="
        relative z-0 overflow-hidden
        pt-32 md:pt-40 lg:pt-48
        pb-16 md:pb-20 lg:pb-28
        bg-gradient-to-b from-[#f5f7ff] via-white to-[#f5fbff]
        dark:from-background-5 dark:via-background-7 dark:to-background-8
      "
    >
      {/* weiches, dezentes Gradient-Overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-[20%] -top-[40%] w-[640px] opacity-60 blur-3xl dark:opacity-40">
          <Image src={gradient12} alt="Gradient" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -left-[20%] bottom-[-30%] w-[520px] opacity-50 blur-3xl dark:opacity-30">
          <Image src={gradient12} alt="Gradient" className="w-full h-full object-cover rotate-180" />
        </div>
      </div>

      <div className="main-container">
        <div className="grid items-center gap-10 lg:gap-16 lg:grid-cols-2">
          {/* LEFT – Text + Benefits + CTAs */}
          <div className="text-left">
            <RevealAnimation delay={0.15}>
              <p className="inline-flex items-center rounded-full border border-border/70 bg-white/70 px-3 py-1 text-[13px] font-medium uppercase tracking-[0.14em] text-secondary dark:bg-background-8/80 dark:text-accent">
                All-in-One KI-Infrastruktur für Gyms, Coaches & Studios
              </p>
            </RevealAnimation>

            <RevealAnimation delay={0.25}>
              <h1 className="mt-4 mb-4 max-w-[720px]">
                Die komplette KI-Plattform
                <br className="hidden md:block" />
                für dein Fitnessstudio.
              </h1>
            </RevealAnimation>

            <RevealAnimation delay={0.35}>
              <p className="max-w-[640px] mb-6 text-secondary/80 dark:text-accent/80">
                PILAR SYSTEMS bündelt Telefonanlage, WhatsApp, E-Mail, DMs, Terminbuchung, Trainingspläne,
                Growth-Analytics und Support in einer Plattform. Basic, Pro oder Elite – du kombinierst nur die
                KI-Module, die dein Studio wirklich braucht.
              </p>
            </RevealAnimation>

            <ul className="mb-10 flex flex-col gap-3">
              {benefits.map((item, idx) => (
                <RevealAnimation key={item.id} delay={0.45 + idx * 0.1}>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-[2px] flex size-[19px] items-center justify-center rounded-full bg-secondary dark:bg-accent/20 shrink-0">
                      <CheckIcon className="h-[18px] w-[18px] fill-white dark:fill-accent" />
                    </span>
                    <span className="text-tagline-2 text-secondary/90 dark:text-accent/80">{item.text}</span>
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
              <div className="mt-6 flex items-center gap-3">
                <figure className="flex -space-x-2">
                  <Image
                    src={avatar9}
                    alt="Pilar Systems Kunde"
                    className="size-8 rounded-full border border-white bg-linear-[156deg,_#FFF_32.92%,_#C6F56F_91%]"
                  />
                  <div className="size-8 rounded-full border border-white bg-secondary/10 text-xs flex items-center justify-center text-secondary/70 dark:text-accent/80">
                    +240
                  </div>
                </figure>
                <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                  Studios & Teams testen bereits die PILAR Plattform.
                </p>
              </div>
            </RevealAnimation>
          </div>

          {/* RIGHT – Clean Dashboard Card */}
          <RevealAnimation delay={0.4}>
            <div className="relative mx-auto max-w-[520px] w-full">
              <div className="absolute -inset-8 rounded-[32px] bg-white/40 blur-3xl dark:bg-background-9/40" />

              <div className="relative rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_22px_60px_rgba(15,23,42,0.18)] dark:border-background-6 dark:bg-background-8/95">
                <div className="mb-4 flex items-center justify-between gap-2">
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

                <div className="grid gap-4 sm:grid-cols-2 mb-4">
                  <div className="rounded-2xl bg-background-2 p-4 dark:bg-background-7">
                    <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                      Automatisierte Kontakte
                    </p>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-sm text-secondary/70 dark:text-accent/70">heute</span>
                      <p className="text-heading-5 font-normal text-secondary dark:text-accent">
                        <NumberAnimation
                          number={240}
                          speed={1400}
                          interval={160}
                          rooms={3}
                          heightSpaceRatio={2}
                        />
                        +
                      </p>
                    </div>
                    <div className="mt-3">
                      <Progress />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-background-1 p-4 dark:bg-background-6">
                    <p className="text-tagline-2 text-secondary/70 dark:text-accent/70">
                      Gebuchte Probetrainings
                    </p>
                    <p className="mt-1 text-heading-5 font-normal text-secondary dark:text-accent">
                      <NumberAnimation
                        number={37}
                        speed={1400}
                        interval={180}
                        rooms={2}
                        heightSpaceRatio={2}
                      />
                    </p>
                    <p className="mt-1 text-tagline-2 text-emerald-600 dark:text-emerald-400">
                      +87% vs. letzter Monat
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-background-2/80 p-4 dark:bg-background-7/90">
                  <div className="flex items-center justify-between gap-3">
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
                        h / Monat
                      </p>
                    </div>
                    <div className="text-right text-tagline-2 text-secondary/70 dark:text-accent/70">
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
