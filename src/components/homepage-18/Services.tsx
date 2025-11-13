import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';

const Services = () => {
  return (
    <section className="pt-16 md:pt-20 lg:pt-[90px] xl:pt-[100px] pb-16 md:pb-20 lg:pb-[90px] xl:pb-[100px] bg-[url('/images/home-page-18/hero-bg.png')] bg-no-repeat bg-cover bg-top">
      <div className="main-container">
        <div className="text-center space-y-5 max-w-[750px] mx-auto mb-14">
          <RevealAnimation delay={0.2}>
            <span className="badge badge-green">Warum Pilar Systems?</span>
          </RevealAnimation>
          <div>
            <RevealAnimation delay={0.3}>
              <h2 className="mb-3">Mehr als nur eine Studio-Software.</h2>
            </RevealAnimation>
            <RevealAnimation delay={0.4}>
              <p className="max-w-[600px] mx-auto">
                Wir ersetzen Telefonstress, Zettelwirtschaft und manuelle Nachverfolgung durch eine KI, die dein Gym
                versteht – vom ersten Kontakt bis zum aktiven Mitglied.
              </p>
            </RevealAnimation>
          </div>
        </div>
        {/* feature Items */}
        <div className="grid grid-cols-12 space-y-8 md:space-y-0 md:gap-8 mb-10 lg:mb-18 max-w-[1010px] mx-auto">
          <RevealAnimation delay={0.5}>
            <div className="col-span-12 md:col-span-6 lg:col-span-7 p-8 rounded-[20px] bg-white dark:bg-background-6 space-y-6 sm:min-h-[288px]">
              <div className="w-full">
                <span className="ns-shape-8 text-[52px] text-secondary dark:text-accent" />
              </div>
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">Vollautomatisiertes Lead- & Termin-Handling.</h5>
                <p className="max-w-[430px]">
                  Deine KI nimmt Anrufe entgegen, beantwortet WhatsApp & E-Mails, qualifiziert Interessenten vor und
                  bucht Probetrainings direkt in deinen Kalender – ohne dass jemand im Büro sitzen muss.
                </p>
              </div>
            </div>
          </RevealAnimation>
          <RevealAnimation delay={0.6}>
            <div className="col-span-12 md:col-span-6 lg:col-span-5 p-8 rounded-[20px] bg-white dark:bg-background-6 space-y-6 sm:min-h-[288px]">
              <div className="w-full">
                <span className="ns-shape-35 text-[52px] text-secondary dark:text-accent" />
              </div>
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">Setup ohne lange Onboarding-Calls.</h5>
                <p>
                  Deine Kunden buchen online, durchlaufen einen geführten Setup-Wizard und die KI lernt alles über dein
                  Gym – komplett digital, ohne Agentur-Termine und ohne Wartezeit.
                </p>
              </div>
            </div>
          </RevealAnimation>
          <RevealAnimation delay={0.7}>
            <div className="col-span-12 md:col-span-6 lg:col-span-5 p-8 rounded-[20px] bg-white dark:bg-background-6 space-y-6 sm:min-h-[288px]">
              <div className="w-full">
                <span className="ns-shape-41 text-[52px] text-secondary dark:text-accent" />
              </div>
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">Mehr Funktionen als klassische Software.</h5>
                <p className="max-w-[430px]">
                  KI-Rezeption, Lead-Nachverfolgung, Terminbuchung, Trainingspläne & Onboarding – statt fünf
                  Einzellösungen bekommst du bei uns ein System, das alles zusammendenkt.
                </p>
              </div>
            </div>
          </RevealAnimation>
          <RevealAnimation delay={0.8}>
            <div className="col-span-12 md:col-span-6 lg:col-span-7 p-8 rounded-[20px] bg-white dark:bg-background-6 space-y-6 sm:min-h-[288px]">
              <div className="w-full">
                <span className="ns-shape-19 text-[52px] text-secondary dark:text-accent" />
              </div>
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">Transparente Preise statt Agenturprojekt.</h5>
                <p className="max-w-[430px]">
                  Klare Pläne, planbare monatliche Kosten und faire Setup-Gebühren – keine versteckten Tagessätze, keine
                  Endlos-Projekte, kein Risiko für dein Gym.
                </p>
              </div>
            </div>
          </RevealAnimation>
        </div>
        <RevealAnimation delay={0.9}>
          <div className="flex items-center justify-center">
            <LinkButton
              href="/contact-us"
              className="btn btn-secondary hover:btn-primary dark:btn-transparent dark:border-primary-50 btn-md w-[85%] md:w-auto mx-auto">
              Kostenloses Erstgespräch buchen
            </LinkButton>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default Services;
