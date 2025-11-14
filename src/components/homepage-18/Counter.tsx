import NumberAnimation from '../animation/NumberAnimation';
import RevealAnimation from '../animation/RevealAnimation';

const Counter = () => {
  return (
    <section className="pt-16 md:pt-20 lg:pt-[90px] xl:pt-[100px] pb-16 md:pb-20 lg:pb-[90px] xl:pb-[100px]">
      <div className="main-container">
        <div className="text-center space-y-3 mb-10 md:mb-[70px]">
          <RevealAnimation delay={0.2}>
            <h2>Ergebnisse, die für sich sprechen.</h2>
          </RevealAnimation>
          <RevealAnimation delay={0.3}>
            <p className="max-w-[680px] mx-auto">
              Mehr Leads, mehr Probetrainings, mehr Verträge – dank vollautomatisierter KI-Rezeption für Fitnessstudios.
            </p>
          </RevealAnimation>
        </div>
        <RevealAnimation delay={0.4}>
          <div className="flex flex-col max-md:gap-y-10 max-lg:gap-x-4 md:flex-row justify-between bg-secondary dark:bg-background-8 rounded-[20px] px-3 lg:px-[60px] py-14">
            <div className="space-y-2 text-center">
              <h3 className="text-white flex items-center justify-center">
                <NumberAnimation number={2400} speed={2000} interval={200} rooms={3} heightSpaceRatio={2} />+
              </h3>
              <p className="text-white/60">Automatisierte Anfragen pro Monat.</p>
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-white flex items-center justify-center">
                <NumberAnimation number={87} speed={2000} interval={200} rooms={2} heightSpaceRatio={2} />%
              </h3>
              <p className="text-white/60">Höhere Lead-Conversion auf Probetrainings.</p>
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-white flex items-center justify-center">
                <NumberAnimation number={300} speed={2000} interval={200} rooms={3} heightSpaceRatio={2} />+
              </h3>
              <p className="text-white/60">Stunden Mitarbeitereinsatz pro Monat gespart.</p>
            </div>
            <div className="space-y-2 text-center">
              <h3 className="text-white flex items-center justify-center">
                <NumberAnimation number={95} speed={2000} interval={200} rooms={2} heightSpaceRatio={2} />%
              </h3>
              <p className="text-white/60">Zufriedene Studios, die täglich mit Pilar Systems arbeiten.</p>
            </div>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default Counter;
