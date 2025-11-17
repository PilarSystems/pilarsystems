// Affiliate Process Section – PILAR SYSTEMS
import RevealAnimation from '../animation/RevealAnimation';
import AffiliatesList from './AffiliatesList';
import AffiliatesStep from './AffiliatesStep';

const AffiliateProcess = () => {
  return (
    <section className="py-14 md:py-16 lg:py-[88px] xl:py-[100px]">
      <div className="main-container">
        <div className="space-y-10 md:space-y-[70px]">
          <div className="text-center max-w-[640px] space-y-3 mx-auto">
            <RevealAnimation delay={0.1}>
              <span className="badge badge-green mb-5">Ablauf</span>
            </RevealAnimation>
            <RevealAnimation delay={0.2}>
              <h2>So funktioniert das PILAR Affiliate-Programm.</h2>
            </RevealAnimation>
            <RevealAnimation delay={0.3}>
              <p className="text-tagline-1 text-secondary/80 dark:text-accent/80">
                In wenigen Schritten vom ersten Kontakt zur wiederkehrenden Provision: Du bewirbst dich, erhältst deinen
                persönlichen Empfehlungslink und begleitest Studios auf dem Weg in die KI-Infrastruktur von PILAR
                SYSTEMS.
              </p>
            </RevealAnimation>
          </div>

          {/* Schritte 1–3 */}
          <AffiliatesStep />
        </div>

        {/* Zusatzinfos: Vorteile, für wen geeignet, was nicht geht */}
        <AffiliatesList />
      </div>
    </section>
  );
};

AffiliateProcess.displayName = 'AffiliateProcess';
export default AffiliateProcess;
