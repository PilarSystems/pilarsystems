import gradient32 from '@public/images/gradient/gradient-32.png';
import gradient33 from '@public/images/gradient/gradient-33.png';
import gradient34 from '@publicimages/gradient/gradient-34.png';
import gradient9 from '@public/images/gradient/gradient-9.png';
import integrationImage1 from '@public/images/home-page-18/integration-image-1.png';
import integrationImage2Dark from '@public/images/home-page-18/integration-image-2-dark.png';
import integrationImage2 from '@public/images/home-page-18/integration-image-2.png';
import integrationImage3Dark from '@public/images/home-page-18/integration-image-3-dark.png';
import integrationImage3 from '@public/images/home-page-18/integration-image-3.png';
import integrationImage4Dark from '@public/images/home-page-18/integration-image-4-dark.png';
import integrationImage4 from '@public/images/home-page-18/integration-image-4.png';

import Image from 'next/image';
import Link from 'next/link';
import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';
import StackCardItem from '../ui/stack-card/StackCardItem';
import StackCardWrapper from '../ui/stack-card/StackCardWrapper';

const Integration = () => {
  return (
    <section className="pt-16 md:pt-20 lg:pt-[90px] xl:pt-[150px] pb-16 md:pb-20 lg:pb-[90px] xl:pb-[250px]">
      <div className="bg-background-2 dark:bg-background-5">
        <div className="main-container">
          <div className="flex flex-col lg:flex-row items-start gap-y-24 gap-x-[140px]">
            {/* Left Content */}
            <div className="w-full lg:flex-1 lg:sticky lg:top-28 max-w-[520px] mx-auto lg:mx-0 text-center lg:text-left">
              <RevealAnimation delay={0.2}>
                <span className="badge badge-green mb-5">PILAR Setup</span>
              </RevealAnimation>

              <RevealAnimation delay={0.3}>
                <h2 className="mb-3 max-w-[529px]">
                  Von der Online-Buchung zu kompletter Automatisierung.
                </h2>
              </RevealAnimation>

              <RevealAnimation delay={0.4}>
                <p className="mb-7 lg:max-w-[620px]">
                  Mit unserem Setup-Wizard bist du in wenigen Minuten startklar: Account anlegen, Kanäle verbinden, Regeln setzen – und PILAR übernimmt Anfragen, Telefonate und Follow-ups automatisch für dein Studio.
                </p>
              </RevealAnimation>

              <RevealAnimation delay={0.5}>
                <div>
                  <LinkButton
                    href="/signup-01"
                    className="btn btn-secondary hover:btn-primary dark:btn-transparent btn-md w-[85%] md:w-auto mx-auto"
                  >
                    Jetzt starten
                  </LinkButton>
                </div>
              </RevealAnimation>
            </div>

            {/* Right: Step Stack */}
            <StackCardWrapper
              topOffset="15vh"
              gap="24px"
              initDelay={100}
              className="w-full lg:flex-1 md:max-w-[50%] sm:max-w-[60%] mx-auto lg:mx-0"
            >
              {/* Step 1 */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="p-2.5 rounded-[20px] relative z-[10] overflow-hidden">
                    <figure className="absolute z-[-1] w-[900px] top-[-99%] left-[-103%] rotate-[-41deg] pointer-events-none">
                      <Image src={gradient32} alt="gradient-border" className="w-full h-full object-cover" />
                    </figure>

                    <figure className="p-8 bg-white dark:bg-background-5 rounded-xl space-y-6">
                      <figcaption className="space-y-2">
                        <h5>1. Account erstellen & Setup-Wizard durchlaufen.</h5>
                        <p className="max-w-[280px]">
                          Du startest online und richtest dein Studio in wenigen Schritten ein – ohne technischen Aufwand.
                        </p>
                      </figcaption>
                      <figure className="max-w-[385px] w-full">
                        <Image src={integrationImage1} alt="Setup Wizard" className="w-full md:max-h-[300px]" />
                      </figure>
                    </figure>
                  </div>
                </div>
              </StackCardItem>

              {/* Step 2 */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="p-2.5 rounded-[20px] relative z-[10] overflow-hidden">
                    <figure className="absolute z-[-1] w-[900px] top-[-111%] left-[-103%] rotate-[-41deg] pointer-events-none">
                      <Image src={gradient33} alt="gradient-border" className="w-full h-full object-cover" />
                    </figure>

                    <figure className="p-8 bg-white dark:bg-background-5 rounded-xl space-y-6">
                      <figcaption className="space-y-2">
                        <h5>2. Kanäle verbinden & Szenarien testen.</h5>
                        <p className="max-w-[280px]">
                          Telefon, WhatsApp Business, E-Mail & Kalender anbinden – danach typische Member-Flows live testen.
                        </p>
                      </figcaption>

                      <div className="rounded-2xl overflow-hidden max-w-[400px] w-full">
                        <Image
                          src={integrationImage2}
                          alt="Channel Integration"
                          className="w-full dark:hidden md:max-h-[300px]"
                        />
                        <Image
                          src={integrationImage2Dark}
                          alt="Channel Integration"
                          className="hidden dark:block w-full md:max-h-[300px]"
                        />
                      </div>
                    </figure>
                  </div>
                </div>
              </StackCardItem>

              {/* Step 3 */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="p-2.5 rounded-[20px] relative z-[10] overflow-hidden">
                    <figure className="absolute z-[-1] w-[900px] top-[-111%] left-[-103%] rotate-[-41deg] pointer-events-none">
                      <Image src={gradient34} alt="gradient-border" className="w-full h-full object-cover" />
                    </figure>

                    <figure className="p-8 bg-white dark:bg-background-5 rounded-xl space-y-6">
                      <figcaption className="space-y-2">
                        <h5>3. Regeln & Ziele für deine KI definieren.</h5>
                        <p className="max-w-[280px]">
                          Lead-Priorität, Probetrainings-Logik, Öffnungszeiten, Follow-ups – alles individuell einstellbar.
                        </p>
                      </figcaption>

                      <div className="rounded-2xl overflow-hidden max-w-[400px] w-full">
                        <Image
                          src={integrationImage3}
                          alt="AI Rules"
                          className="w-full dark:hidden md:max-h-[300px]"
                        />
                        <Image
                          src={integrationImage3Dark}
                          alt="AI Rules"
                          className="hidden dark:block w-full md:max-h-[300px]"
                        />
                      </div>
                    </figure>
                  </div>
                </div>
              </StackCardItem>

              {/* Step 4 */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="p-2.5 rounded-[20px] relative z-[10] overflow-hidden">
                    <figure className="absolute z-[-1] w-[900px] top-[-97%] left-[-60%] rotate-[245deg] pointer-events-none">
                      <Image src={gradient9} alt="gradient-border" className="w-full h-full object-cover" />
                    </figure>

                    <figure className="p-8 bg-white dark:bg-background-5 rounded-xl space-y-6">
                      <figcaption className="space-y-2">
                        <h5>4. Live gehen & Automatisierung nutzen.</h5>
                        <p className="max-w-[280px]">
                          Sobald alles sitzt, übernimmt PILAR: Anfragen beantworten, Leads nachfassen, Termine koordinieren.
                        </p>
                      </figcaption>

                      <div className="rounded-2xl overflow-hidden max-w-[400px] w-full">
                        <Link href="/signup-01">
                          <Image
                            src={integrationImage4}
                            alt="Go Live"
                            className="w-full dark:hidden rounded-xl md:max-h-[300px]"
                          />
                          <Image
                            src={integrationImage4Dark}
                            alt="Go Live"
                            className="hidden dark:block w-full rounded-xl md:max-h-[300px]"
                          />
                        </Link>
                      </div>
                    </figure>
                  </div>
                </div>
              </StackCardItem>
            </StackCardWrapper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integration;
