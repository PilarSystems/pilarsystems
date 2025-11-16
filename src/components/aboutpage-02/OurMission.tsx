import feature1Img from '@public/images/home-page-8/feature-1.png';
import Image from 'next/image';
import NumberAnimation from '../animation/NumberAnimation';
import RevealAnimation from '../animation/RevealAnimation';
import Progress from '../homepage-04/Progress';

const OurMission = () => {
  return (
    <section className="pt-14 md:pt-16 lg:pt-[88px] xl:pt-[100px] pb-14 md:pb-16 lg:pb-[88px] xl:pb-[100px] overflow-hidden">
      <div className="main-container">
        <div className="grid grid-cols-12 lg:gap-x-0 xl:gap-x-28 gap-y-12 items-center">
          <div className="col-span-12 lg:col-span-6">
            <div className="space-y-3">
              <RevealAnimation delay={0.2}>
                <span className="badge badge-cyan mb-5">Unsere Mission</span>
              </RevealAnimation>
              <RevealAnimation delay={0.3}>
                <h2>
                  Wir machen aus jedem Gym eine skalierbare Vertriebs- und Service-Maschine.
                </h2>
              </RevealAnimation>
              <RevealAnimation delay={0.4}>
                <p>
                  Unsere Mission ist es, Fitnessstudios von manuellen Abläufen zu befreien. Statt Zettelwirtschaft,
                  überfüllten Postfächern und verpassten Anrufen sorgt Pilar Systems dafür, dass Leads automatisch
                  erfasst, qualifiziert, nachverfolgt und in Verträge verwandelt werden – alles in einem System.
                </p>
              </RevealAnimation>
              <RevealAnimation delay={0.5}>
                <p>
                  Dabei geht es nicht nur um KI, sondern um Klarheit: Was passiert mit jeder Anfrage? Wer kommt wirklich
                  zum Probetraining? Welche Kampagne bringt Verträge? Pilar macht diese Fragen messbar – und damit
                  steuerbar.
                </p>
              </RevealAnimation>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div>
              <figure className="relative w-full md:w-[500px]">
                <RevealAnimation delay={0.4}>
                  <div className="w-full">
                    <Image src={feature1Img} alt="Dashboard-Ansicht von Pilar Systems" className="w-full" />
                  </div>
                </RevealAnimation>
                <RevealAnimation delay={0.5} direction="right" offset={100}>
                  <div className="p-6 absolute top-3/4 -translate-y-3/4 left-[35%] sm:left-[63%] md:left-[60%] lg:left-[1%] xl:left-[50%] 2xl:left-[60%] w-[220px] md:w-[288px] h-[100px] rounded-xl overflow-hidden shadow-2 bg-white dark:bg-background-7">
                    <figcaption className="flex justify-between gap-2">
                      <span className="text-tagline-1 font-normal dark:text-accent">
                        Monatliche automatisierte Anfragen
                      </span>
                      <p className="text-lg font-medium leading-[1.5] text-secondary dark:text-accent flex items-center gap-1">
                        +
                        <NumberAnimation
                          number={2400}
                          speed={1000}
                          interval={180}
                          rooms={4}
                          heightSpaceRatio={2.5}
                          className="text-lg font-medium leading-[1.5] text-secondary dark:text-accent"
                        />
                      </p>
                    </figcaption>
                    <Progress />
                  </div>
                </RevealAnimation>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMission;
