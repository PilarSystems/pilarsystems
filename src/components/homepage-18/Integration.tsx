import gradient32 from '@public/images/gradient/gradient-32.png';
import gradient33 from '@public/images/gradient/gradient-33.png';
import gradient34 from '@public/images/gradient/gradient-34.png';
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
            <div className="w-full lg:flex-1 lg:sticky lg:top-28 lg:max-w-full max-w-[520px] lg:mx-0 mx-auto text-center lg:text-left">
              <RevealAnimation delay={0.2}>
                <span className="badge badge-green mb-5">Ablauf</span>
              </RevealAnimation>
              <RevealAnimation delay={0.3}>
                <h2 className="mb-3 max-w-[529px]">So wird aus Anfragen automatisch Umsatz.</h2>
              </RevealAnimation>
              <RevealAnimation delay={0.4}>
                <p className="mb-7 lg:max-w-[620px]">
                  Von der Online-Buchung über das Setup bis zur laufenden Automatisierung – Pilar Systems fügt sich in
                  deinen Alltag ein, ohne dein Team zu überfordern.
                </p>
              </RevealAnimation>
              <RevealAnimation delay={0.5}>
                <div>
                  <LinkButton
                    href="/process-01"
                    rel="noopener noreferrer"
                    className="btn btn-secondary hover:btn-primary dark:btn-transparent btn-md w-[85%] md:w-auto mx-auto">
                    Ablauf im Detail ansehen
                  </LinkButton>
                </div>
              </RevealAnimation>
            </div>

            <StackCardWrapper
              topOffset="15vh"
              gap="24px"
              initDelay={100}
              className="w-full lg:flex-1 lg:max-w-full md:max-w-[50%] sm:max-w-[60%] lg:mx-0 mx-auto max-w-full">
              {/* Step 1 */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="p-2.5 rounded-[20px] relative z-[10] overflow-hidden">
                    {/* gradient border img */}
                    <figure className="absolute z-[-1] w-[600px] md:w-[900px] xl:w-[1050px] top-[-66%] md:top-[-99%] left-[-52%] md:left-[-103%] rotate-[-41deg] select-none pointer-events-none">
                      <Image src={gradient32} alt="gradient-border" className="w-full h-full object-cover" />
                    </figure>
                    <figure className="p-8 bg-white dark:bg-background-5 rounded-xl space-y-6">
                      <figcaption className="space-y-2">
                        <h5>Online starten und Setup-Wizard durchlaufen.</h5>
                        <p className="max-w-[250px]">
                          Dein Studio wählt einen Plan, erstellt einen Account und führt den geführten Setup-Wizard
                          durch – ganz ohne Telefontermin oder Vor-Ort-Besuch.
                        </p>
                      </figcaption>
                      <figure className="max-w-[385px] w-full">
                        <Image
                          src={integrationImage1}
                          alt="Online-Setup und Account-Erstellung"
                          className="w-full md:max-h-[300px] md:min-h-[300px]"
                        />
                      </figure>
                    </figure>
                  </div>
                </div>
              </StackCardItem>

              {/* Step 2 */}
              <StackCardItem>
                <div className="lg:max-w-[483px] max-w-full max-sm:min-h-[433px]">
                  <div className="p-2.5 rounded-[20px] relative z-[10] overflow-hidden">
                    {/* gradient border img */}
                    <figure className="absolute z-[-1] w-[600px] md:w-[900px] xl:w-[1050px] top-[-76%] md:top-[-111%] left-[-62%] md:left-[-103%] rotate-[-41deg] select-none pointer-events-none">
                      <Image src={gradient33} alt="gradient-border" className="w-full h-full object-cover" />
                    </figure>
                    <figure className="p-8 bg-white dark:bg-background-5 rounded-xl space-y-6">
                      <figcaption className="space-y-2">
                        <h5>Systeme verbinden und alles testen.</h5>
                        <p className="max-w-[250px]">
                          Telefonanlage, WhatsApp, E-Mail-Postfach und Kalender werden angebunden – danach testest du
                          gemeinsam mit uns typische Szenarien aus Sicht deiner Mitglieder.
                        </p>
                      </figcaption>
                      <div className="rounded-2xl overflow-hidden max-w-[400px] w-full">
                        <Image
                          src={integrationImage2}
                          alt="Systeme verbinden"
                          className="w-full dark:hidden md:max-h-[300px] md:min-h-[300px]"
                        />
                        <Image
                          src={integrationImage2Dark}
                          alt="Systeme verbinden"
                          className="w-full hidden dark:block md:max-h-[300px] md:min-h-[300px]"
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
                    {/* gradient border img */}
                    <figure className="absolute z-[-1] w-[600px] md:w-[900px] xl:w-[1050px] top-[-75%] md:top-[-111%] left-[-65%] md:left-[-103%] rotate-[-41deg] select-none pointer-events-none">
                      <Image src={gradient34} alt="gradient-border" className="w-full h-full object-cover" />
                    </figure>
                    <figure className="p-8 bg-white dark:bg-background-5 rounded-xl space-y-6">
                      <figcaption className="space-y-2">
                        <h5>Ziele und Regeln für deine KI festlegen.</h5>
                        <p className="max-w-[250px]">
                          Du definierst, welche Leads priorisiert werden, wie Probetrainings vergeben werden und welche
                          Angebote kommuniziert werden – die KI hält sich an deine Regeln.
                        </p>
                      </figcaption>
                      <div className="rounded-2xl overflow-hidden max-w-[400px] w-full">
                        <Image
                          src={integrationImage3}
                          alt="KI-Regeln festlegen"
                          className="w-full dark:hidden md:max-h-[300px] md:min-h-[300px]"
                        />
                        <Image
                          src={integrationImage3Dark}
                          alt="KI-Regeln festlegen"
                          className="w-full hidden dark:block md:max-h-[300px] md:min-h-[300px]"
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
                    {/* gradient border img */}
                    <figure className="absolute z-[-1] w-[600px] md:w-[900px] xl:w-[1050px] top-[-66%] md:top-[-97%] max-[376px]:left-[-40%] left-[-30%] md:left-[-60%] lg:left-[-48%] rotate-[245deg] select-none pointer-events-none">
                      <Image src={gradient9} alt="gradient-border" className="w-full h-full object-cover" />
                    </figure>
                    <figure className="p-8 bg-white dark:bg-background-5 rounded-xl space-y-6">
                      <figcaption className="space-y-2">
                        <h5>Live gehen und Automatisierung nutzen.</h5>
                        <p className="max-w-[250px]">
                          Danach übernimmt Pilar Systems die Routine: Anfragen beantworten, Leads nachfassen und
                          Probetrainings koordinieren – dein Team konzentriert sich aufs Training.
                        </p>
                      </figcaption>
                      <div className="rounded-2xl overflow-hidden max-w-[400px] w-full">
                        <Link href="/process-01">
                          <Image
                            src={integrationImage4}
                            alt="Live-Automatisierung"
                            className="w-full dark:hidden rounded-xl md:max-h-[300px] md:min-h-[300px]"
                          />
                          <Image
                            src={integrationImage4Dark}
                            alt="Live-Automatisierung"
                            className="w-full hidden dark:block rounded-xl md:max-h-[300px] md:min-h-[300px]"
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
