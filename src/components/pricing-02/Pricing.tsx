'use client';
import Link from 'next/link';
import { useState } from 'react';
import RevealAnimation from '../animation/RevealAnimation';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState<boolean>(false);

  const basicMonthly = 149;
  const proMonthly = 249;
  const basicYearly = basicMonthly * 10; // 2 Monate geschenkt
  const proYearly = proMonthly * 10;

  return (
    <section className="relative pb-20 md:pb-[100px] lg:pb-[150px] xl:pb-[200px] pt-[100px]">
      <div className="main-container flex flex-col gap-[70px]">
        <div className="flex flex-col items-center text-center">
          <RevealAnimation delay={0.2}>
            <span className="badge badge-yellow-v2 mb-5">Preise & Pakete</span>
          </RevealAnimation>
          <RevealAnimation delay={0.3}>
            <h2 className="max-w-[650px] mx-auto mb-4">
              Wähle den PILAR Plan, der zu deinem Studio passt.
            </h2>
          </RevealAnimation>
          <RevealAnimation delay={0.4}>
            <p className="max-w-[620px] mx-auto mb-8 text-secondary/70 dark:text-accent/70">
              Alle Pläne bestehen aus einer einmaligen Setup-Gebühr und einer monatlichen Lizenz. Du startest mit Basic
              oder Pro – und kannst später Add-ons wie Voice, KI-Coach, Creator oder White-Label ergänzen.
            </p>
          </RevealAnimation>

          <RevealAnimation delay={0.5}>
            <div className="relative z-0">
              <RevealAnimation delay={1} duration={1.2} direction="up" offset={200}>
                <span className="absolute z-11 -right-6 -top-2.5 bg-secondary dark:bg-accent text-accent dark:text-secondary inline-block font-normal capitalize text-tagline-2 px-3.5 py-1.5 shadow-xs rounded-[36px] rotate-[20deg] w-[110px]">
                  2 Monate frei
                </span>
              </RevealAnimation>
              <label className="relative inline-flex items-center cursor-pointer z-[10] bg-white dark:bg-background-9 py-4 px-6 rounded-full gap-3 shadow-1/40">
                <span className="text-sm md:text-base text-secondary dark:text-accent font-normal">
                  Monatlich
                </span>
                <input
                  type="checkbox"
                  id="priceCheck"
                  checked={isAnnual}
                  onChange={(e) => setIsAnnual(e.target.checked)}
                  className="sr-only peer"
                  aria-label="Zwischen monatlicher und jährlicher Abrechnung wechseln"
                />
                <span className="relative w-13 h-[28px] bg-secondary rounded-[34px] dark:bg-accent peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:start-[2px] peer-checked:after:start-[2px] after:bg-accent dark:after:bg-background-9 after:rounded-full after:h-6 after:w-6 after:transition-all" />
                <span className="text-sm md:text-base text-secondary dark:text-accent font-normal">
                  Jährlich
                </span>
              </label>
            </div>
          </RevealAnimation>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-8">
            {/* Basic */}
            <RevealAnimation delay={0.3} instant>
              <div className="bg-background-3 dark:bg-background-5 flex-1 p-8 rounded-[20px] max-lg:w-full">
                <h3 className="mb-1 font-normal text-heading-5">Basic</h3>
                <p className="mb-6 max-w-[260px] text-secondary/70 dark:text-accent/70">
                  Für Studios, die ihre Anfragen endlich sauber bündeln und automatisieren wollen.
                </p>
                <div className="mb-4">
                  {isAnnual ? (
                    <>
                      <p className="text-heading-4 font-normal">
                        €<span>{basicYearly.toLocaleString('de-DE')}</span>
                      </p>
                      <p className="text-secondary/70 dark:text-accent/70 text-tagline-2">
                        pro Jahr (2 Monate geschenkt)
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-heading-4 font-normal">
                        €<span>{basicMonthly}</span>
                      </p>
                      <p className="text-secondary/70 dark:text-accent/70 text-tagline-2">pro Monat</p>
                    </>
                  )}
                </div>
                <p className="text-tagline-2 text-secondary/70 dark:text-accent/70 mb-6">
                  Setup-Gebühr: <span className="font-medium">500&nbsp;€ einmalig</span>
                </p>

                <Link
                  href="/signup-01?plan=starter"
                  className="btn btn-md btn-white dark:btn-white-dark hover:btn-secondary dark:hover:btn-accent w-full block text-center mb-8 before:content-none first-letter:uppercase"
                >
                  Basic wählen
                </Link>
                <ul className="relative list-none space-y-2.5 text-tagline-1">
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded-full bg-secondary dark:bg-accent flex items-center justify-center" />
                    <span className="text-secondary dark:text-accent">
                      KI-Inbox für WhatsApp, E-Mail & Website
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded-full bg-secondary dark:bg-accent flex items-center justify-center" />
                    <span className="text-secondary dark:text-accent">
                      Automatisches Follow-up bis zum Probetraining
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded-full bg-secondary/30 dark:bg-accent/30 flex items-center justify-center" />
                    <span className="text-secondary/70 dark:text-accent/70">
                      Basis-Dashboard für Leads & Kontakte
                    </span>
                  </li>
                </ul>
              </div>
            </RevealAnimation>

            {/* Pro – Meist gewählt */}
            <RevealAnimation delay={0.4} instant>
              <div className="p-2.5 rounded-[20px] flex-1 bg-[url('/images/home-page-2/price-bg.png')] bg-no-repeat bg-center bg-cover max-lg:w-full">
                <div className="bg-white dark:bg-background-8 p-8 rounded-[12px] relative overflow-hidden">
                  <span className="absolute -top-4 left-0 rounded-full bg-accent/90 px-3 py-[2px] text-[11px] font-medium text-black">
                    Meist gewählt
                  </span>
                  <div className="mt-3">
                    <h3 className="mb-1.5 font-normal text-heading-5">Pro</h3>
                    <p className="mb-6 text-secondary/70 dark:text-accent/70 max-w-[260px]">
                      Für Studios mit höherem Anfragevolumen, Telefon, mehreren Kanälen & Standorten.
                    </p>
                    <div className="mb-4">
                      {isAnnual ? (
                        <>
                          <p className="text-heading-4 font-normal">
                            €<span>{proYearly.toLocaleString('de-DE')}</span>
                          </p>
                          <p className="text-secondary/70 dark:text-accent/70 text-tagline-2">
                            pro Jahr (2 Monate geschenkt)
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-heading-4 font-normal">
                            €<span>{proMonthly}</span>
                          </p>
                          <p className="text-secondary/70 dark:text-accent/70 text-tagline-2">pro Monat</p>
                        </>
                      )}
                    </div>
                    <p className="text-tagline-2 text-secondary/70 dark:text-accent/70 mb-6">
                      Setup-Gebühr: <span className="font-medium">899&nbsp;€ einmalig</span>
                    </p>

                    <Link
                      href="/signup-01?plan=growth"
                      className="btn btn-md btn-secondary dark:btn-accent hover:btn-primary w-full block mb-8 before:content-none first-letter:uppercase"
                    >
                      Pro aktivieren
                    </Link>
                    <ul className="relative list-none space-y-2.5 text-tagline-1">
                      <li className="flex items-center gap-2.5">
                        <span className="size-5 rounded-full bg-secondary dark:bg-accent flex items-center justify-center" />
                        <span className="text-secondary dark:text-accent">
                          Alles aus Basic plus KI-Telefonanlage
                        </span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="size-5 rounded-full bg-secondary dark:bg-accent flex items-center justify-center" />
                        <span className="text-secondary dark:text-accent">
                          Synchroner Kalender für Probetrainings & Verträge
                        </span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="size-5 rounded-full bg-secondary dark:bg-accent flex items-center justify-center" />
                        <span className="text-secondary dark:text-accent">
                          Erweiterte Workflows & Prioritäts-Support
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </RevealAnimation>

            {/* Elite */}
            <RevealAnimation delay={0.5} instant>
              <div className="bg-background-3 dark:bg-background-5 flex-1 p-8 rounded-[20px] max-lg:w-full">
                <h3 className="mb-1 font-normal text-heading-5">Elite</h3>
                <p className="mb-6 max-w-[260px] text-secondary/70 dark:text-accent/70">
                  Für Ketten, Franchise-Systeme & High-Volume-Gyms mit mehreren Standorten & Marken.
                </p>
                <div className="mb-4">
                  <p className="text-heading-4 font-normal">Preis auf Anfrage</p>
                  <p className="text-secondary/70 dark:text-accent/70 text-tagline-2">
                    inklusive Setup & individueller Konditionen
                  </p>
                </div>
                <p className="text-tagline-2 text-secondary/70 dark:text-accent/70 mb-6">
                  KI-Coach, Growth-Analytics, Multi-Location, White-Label & individuelle SLAs.
                </p>

                <Link
                  href="/contact-us?plan=elite"
                  className="btn btn-md btn-white dark:btn-white-dark hover:btn-secondary dark:hover:btn-accent w-full block mb-8 before:content-none first-letter:uppercase"
                >
                  Elite anfragen
                </Link>
                <ul className="relative list-none space-y-2.5 text-tagline-1">
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded-full bg-secondary dark:bg-accent flex items-center justify-center" />
                    <span className="text-secondary dark:text-accent">
                      KI-Coach über WhatsApp – später eigene App
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded-full bg-secondary dark:bg-accent flex items-center justify-center" />
                    <span className="text-secondary dark:text-accent">
                      Multi-Location & mehrere Marken in einem Account
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="size-5 rounded-full bg-secondary dark:bg-accent flex items-center justify-center" />
                    <span className="text-secondary dark:text-accent">
                      Individuelle Workflows, SLAs & Growth-Support
                    </span>
                  </li>
                </ul>
              </div>
            </RevealAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
