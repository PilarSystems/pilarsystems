import feature1Dark from '@public/images/home-page-18/feature-1-dark.png';
import feature1 from '@public/images/home-page-18/feature-1.png';
import feature2Dark from '@public/images/home-page-18/feature-2-dark.png';
import feature2 from '@public/images/home-page-18/feature-2.png';
import feature3Dark from '@public/images/home-page-18/feature-3-dark.png';
import feature3 from '@public/images/home-page-18/feature-3.png';
import feature4Dark from '@public/images/home-page-18/feature-4-dark.png';
import feature4 from '@public/images/home-page-18/feature-4.png';
import Image from 'next/image';
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
              <h2 className="mb-3">Alles, was moderne Gyms heute brauchen.</h2>
            </RevealAnimation>
            <RevealAnimation delay={0.4}>
              <p className="text-secondary/60 dark:text-accent/60 max-w-[600px] mx-auto">
                Pilar Systems verbindet KI-Rezeption, Terminplanung und Trainingsorganisation in einer Plattform – damit
                du mehr Zeit für deine Mitglieder hast und kein Lead mehr verloren geht.
              </p>
            </RevealAnimation>
          </div>
        </div>
        {/* feature Items */}
        <div className="grid grid-cols-12 space-y-8 md:space-y-0 md:gap-8 mb-10 xl:mb-18">
          <RevealAnimation delay={0.5}>
            <div className="col-span-12 md:col-span-6 lg:col-span-8 p-8 rounded-[20px] bg-background-3 dark:bg-background-7 space-y-6">
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">KI-Rezeption für alle Kanäle.</h5>
                <p className="max-w-[450px]">
                  Telefon, WhatsApp, E-Mail und Website-Anfragen werden von deiner KI beantwortet, vorqualifiziert und
                  bis zum gebuchten Probetraining begleitet – in deinem Studio-Branding.
                </p>
              </div>
              <figure className="w-full">
                <Image
                  src={feature1}
                  alt="feature image"
                  className="w-full object-cover rounded-2xl hidden dark:block"
                />
                <Image
                  src={feature1Dark}
                  alt="feature image"
                  className="w-full object-cover rounded-2xl block dark:hidden"
                />
              </figure>
            </div>
          </RevealAnimation>
          <RevealAnimation delay={0.6}>
            <div className="col-span-12 md:col-span-6 lg:col-span-4 p-8 rounded-[20px] bg-background-3 dark:bg-background-7 space-y-6">
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">Nahtlose Integrationen.</h5>
                <p className="max-w-[220px]">
                  Verbinde Telefonanlage, WhatsApp, E-Mail und bestehende Studio-Software – ohne komplizierte
                  IT-Projekte.
                </p>
              </div>
              <figure className="w-full">
                <Image
                  src={feature2}
                  alt="feature image"
                  className="w-full object-cover rounded-2xl block dark:hidden"
                />
                <Image
                  src={feature2Dark}
                  alt="feature image"
                  className="w-full object-cover rounded-2xl hidden dark:block"
                />
              </figure>
            </div>
          </RevealAnimation>
          <RevealAnimation delay={0.7}>
            <div className="col-span-12 md:col-span-6 lg:col-span-4 p-8 rounded-[20px] bg-background-3 dark:bg-background-7 space-y-6">
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">Klares Dashboard für dein Team.</h5>
                <p>
                  Alle Leads, Termine, Probetrainings und Trainingspläne auf einen Blick – ohne Excel und ohne Chaos im
                  Postfach.
                </p>
              </div>
              <figure className="w-full">
                <Image
                  src={feature3}
                  alt="feature image"
                  className="w-full object-cover rounded-2xl block dark:hidden"
                />
                <Image
                  src={feature3Dark}
                  alt="feature image"
                  className="w-full object-cover rounded-2xl hidden dark:block"
                />
              </figure>
            </div>
          </RevealAnimation>
          <RevealAnimation delay={0.8}>
            <div className="col-span-12 md:col-span-6 lg:col-span-8 p-8 rounded-[20px] bg-background-3 dark:bg-background-7 space-y-6">
              <div className="space-y-2 max-w-[285px]">
                <h5 className="max-sm:text-heading-6">Stabil, sicher und skalierbar.</h5>
                <p className="max-w-[311px]">
                  DSGVO-konforme Infrastruktur, hohe Verfügbarkeit und regelmäßige Updates – gebaut, um mit deinem Gym
                  und deinen Standorten mitzuwachsen.
                </p>
              </div>
              <figure className="w-full">
                <Image
                  src={feature4}
                  alt="feature image"
                  className="w-full h-full object-cover rounded-2xl block dark:hidden"
                />
                <Image
                  src={feature4Dark}
                  alt="feature image"
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
