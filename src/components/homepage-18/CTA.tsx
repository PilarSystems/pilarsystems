import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';

const CTA = () => {
  return (
    <section className="pb-14 pt-14 md:pb-16 md:pt-16 lg:pb-[76px] lg:pt-[76px] bg-secondary dark:bg-background-5">
      <div className="main-container">
        <div className="text-center max-w-[690px] mx-auto">
          <RevealAnimation>
            <span className="badge badge-blur mb-5 text-ns-yellow">Jetzt starten</span>
          </RevealAnimation>

          <RevealAnimation>
            <h2 className="mb-3 text-white">
              Automatisiere deine Studio-Rezeption in wenigen Minuten.
            </h2>
          </RevealAnimation>

          <RevealAnimation>
            <p className="mb-6 text-white/60">
              Weniger Telefonstress, mehr Probetrainings, bessere Abläufe – alles in einem System.
              Pilar Systems erledigt die Arbeit im Hintergrund, damit du dich auf dein Studio konzentrieren kannst.
            </p>
          </RevealAnimation>

          <RevealAnimation>
            <div className="md:inline-block text-center">
              <LinkButton
                href="/signup-01"
                className="btn btn-primary btn-md w-[85%] md:w-auto hover:btn-white dark:hover:btn-accent">
                Jetzt loslegen
              </LinkButton>
            </div>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default CTA;
