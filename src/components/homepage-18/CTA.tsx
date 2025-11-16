import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';

const CTA = () => {
  return (
    <section className="pb-14 pt-14 md:pb-16 md:pt-16 lg:pb-[76px] lg:pt-[76px] bg-secondary dark:bg-background-5">
      <div className="main-container">
        <div className="text-center max-w-[690px] mx-auto">
          <RevealAnimation>
            <span className="badge badge-blur mb-5 text-ns-yellow">Bereit für PILAR</span>
          </RevealAnimation>

          <RevealAnimation>
            <h2 className="mb-3 text-white">
              Starte deine komplette KI-Plattform für dein Studio.
            </h2>
          </RevealAnimation>

          <RevealAnimation>
            <p className="mb-6 text-white/60">
              Telefon, WhatsApp, E-Mail, DMs, Trainingspläne, Kalender und Growth-Analytics – in einem System.
              PILAR SYSTEMS automatisiert Anfragen, Follow-ups und Termine, damit du mehr Zeit für dein Gym
              und deine Mitglieder hast.
            </p>
          </RevealAnimation>

          <RevealAnimation>
            <div className="md:inline-block text-center">
              <LinkButton
                href="/signup-01"
                className="btn btn-primary btn-md w-[85%] md:w-auto hover:btn-white dark:hover:btn-accent"
                aria-label="Account erstellen und mit PILAR SYSTEMS starten">
                Jetzt PILAR testen
              </LinkButton>
            </div>
          </RevealAnimation>

          <RevealAnimation>
            <p className="mt-4 text-xs text-white/60">
              In wenigen Minuten registrieren, Setup-Wizard durchlaufen und mit deinem ersten Kanal live gehen.
            </p>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default CTA;
