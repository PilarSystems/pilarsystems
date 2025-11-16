import feature1Dark from '@public/images/home-page-18/feature-1-dark.png';
import feature1 from '@public/images/home-page-18/feature-1.png';
import feature2Dark from '@public/images/home-page-18/feature-2-dark.png';
import feature2 from '@public/images/home-page-18/feature-2.png';
import feature3Dark from '@public/images/home-page-18/feature-3-dark.png';
import feature3 from '@public/images/home-page-18/feature-3.png';
import feature4Dark from '@public/images/home-page-18/feature-4-dark.png';
import feature4 from '@public/images/home-page-18/feature-4.png';
import Image from 'next/image';
import Link from 'next/link';
import RevealAnimation from '../animation/RevealAnimation';

const Feature = () => {
  return (
    <section className="pt-16 md:pt-20 lg:pt-[90px] xl:pt-[100px] pb-16 md:pb-20 lg:pb-[90px] xl:pb-[100px] bg-white dark:bg-black">
      <div className="main-container">
        <div className="text-center space-y-5 max-w-[750px] mx-auto mb-10 md:mb-[70px]">
          <RevealAnimation delay={0.2}>
            <span className="badge badge-green">Funktionen</span>
          </RevealAnimation>
          <div>
            <RevealAnimation delay={0.3}>
              <h2 className="mb-3">Eine Plattform. Alle KI-Module für dein Studio.</h2>
            </RevealAnimation>
            <RevealAnimation delay={0.4}>
              <p className="text-secondary/60 dark:text-accent/60 max-w-[600px] mx-auto">
                PILAR SYSTEMS bündelt KI-Rezeption, Telefonanlage, WhatsApp, E-Mail, DMs, Kalender, Trainingspläne,
                Growth-Analytics und mehr in einem Dashboard – modular aufgebaut, damit du nur das buchst, was dein Gym
                wirklich braucht.
              </p>
            </RevealAnimation>
            <RevealAnimation delay={0.5}>
              <div className="mt-4">
                <Link
                  href="/signup-01"
                  className="inline-flex items-center text-tagline-2 font-medium text-secondary dark:text-accent underline underline-offset-4">
                  Jetzt PILAR testen – in wenigen Minuten startklar
                </Link>
              </div>
            </RevealAnimation>
          </div>
        </div>

        {/* feature Items */}
        <div className="grid grid-cols-12 space-y-8 md:space-y-0 md:gap-8 mb-10 xl:mb-18">
          <RevealAnimation delay={0.5}>
            <div className="col-span-12 md:col-span-6 lg:col-span-8 p-8 rounded-[20px] bg-background-3 dark:bg-background-7 space-y-6">
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">KI-Rezeption für alle Kanäle.</h5>
                <p className="max-w-[470px]">
                  Telefon, WhatsApp, E-Mail und Instagram-DMs werden von deiner KI angenommen, vorqualifiziert und bis
                  zum gebuchten Probetraining oder Vertrag begleitet – 24/7 in deinem Studio-Branding, ohne Callcenter
                  oder Minijobs.
                </p>
              </div>
              <figure className="w-full">
                <Image
                  src={feature1}
                  alt="KI-Rezeption für alle Kanäle"
                  className="w-full object-cover rounded-2xl block dark:hidden"
                />
                <Image
                  src={feature1Dark}
                  alt="KI-Rezeption für alle Kanäle"
                  className="w-full object-cover rounded-2xl hidden dark:block"
                />
              </figure>
            </div>
          </RevealAnimation>

          <RevealAnimation delay={0.6}>
            <div className="col-span-12 md:col-span-6 lg:col-span-4 p-8 rounded-[20px] bg-background-3 dark:bg-background-7 space-y-6">
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">Setup-Wizard & Integrationen.</h5>
              <p className="max-w-[240px]">
                  Geführtes Onboarding statt IT-Projekt: Verbinde Telefonanlage, WhatsApp Business, Kalender und
                  bestehende Studio-Software in wenigen Schritten – fertig konfiguriert über den Setup-Wizard.
                </p>
              </div>
              <figure className="w-full">
                <Image
                  src={feature2}
                  alt="Setup-Wizard & Integrationen"
                  className="w-full object-cover rounded-2xl block dark:hidden"
                />
                <Image
                  src={feature2Dark}
                  alt="Setup-Wizard & Integrationen"
                  className="w-full object-cover rounded-2xl hidden dark:block"
                />
              </figure>
            </div>
          </RevealAnimation>

          <RevealAnimation delay={0.7}>
            <div className="col-span-12 md:col-span-6 lg:col-span-4 p-8 rounded-[20px] bg-background-3 dark:bg-background-7 space-y-6">
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">KI-Coach & Creative Planner.</h5>
                <p>
                  Erstelle individuelle Trainingspläne, Check-in-Workflows und Content-Ideen mit KI-Unterstützung.
                  Deine Mitglieder erhalten klare Pläne, dein Team bekommt weniger Rückfragen – und mehr Zeit auf der
                  Fläche.
                </p>
              </div>
              <figure className="w-full">
                <Image
                  src={feature3}
                  alt="KI-Coach & Creative Planner"
                  className="w-full object-cover rounded-2xl block dark:hidden"
                />
                <Image
                  src={feature3Dark}
                  alt="KI-Coach & Creative Planner"
                  className="w-full object-cover rounded-2xl hidden dark:block"
                />
              </figure>
            </div>
          </RevealAnimation>

          <RevealAnimation delay={0.8}>
            <div className="col-span-12 md:col-span-6 lg:col-span-8 p-8 rounded-[20px] bg-background-3 dark:bg-background-7 space-y-6">
              <div className="space-y-2 max-w-[360px]">
                <h5 className="max-sm:text-heading-6">Growth-Analytics, White-Label & Affiliate-ready.</h5>
                <p className="max-w-[360px]">
                  Behalte Leads, Abschlüsse, No-Shows und Kampagnen-Performance im Blick. Mit optionalem White-Label,
                  Multi-Studio-Add-on und Affiliate-Integration wächst PILAR mit dir – egal ob Einzelstudio,
                  Franchisekette oder Agency-Setup.
                </p>
              </div>
              <figure className="w-full">
                <Image
                  src={feature4}
                  alt="Growth-Analytics, White-Label & Affiliate-ready"
                  className="w-full h-full object-cover rounded-2xl block dark:hidden"
                />
                <Image
                  src={feature4Dark}
                  alt="Growth-Analytics, White-Label & Affiliate-ready"
                  className="w-full h-full object-cover rounded-2xl hidden dark:block"
                />
              </figure>
            </div>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default Feature;
