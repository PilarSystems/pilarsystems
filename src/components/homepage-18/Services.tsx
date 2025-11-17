import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';

const Services = () => {
  return (
    <section className="pt-16 md:pt-20 lg:pt-[90px] xl:pt-[100px] pb-16 md:pb-20 lg:pb-[90px] xl:pb-[100px] bg-gradient-to-b from-background-3/70 via-background-1 to-background-3 dark:from-background-8 dark:via-background-9 dark:to-background-8">
      <div className="main-container">
        {/* Heading */}
        <div className="text-center space-y-5 max-w-[750px] mx-auto mb-14">
          <RevealAnimation delay={0.2}>
            <span className="badge badge-green">Warum PILAR?</span>
          </RevealAnimation>
          <div>
            <RevealAnimation delay={0.3}>
              <h2 className="mb-3">Eine KI-Plattform, die dein Studio wirklich entlastet.</h2>
            </RevealAnimation>
            <RevealAnimation delay={0.4}>
              <p className="max-w-[600px] mx-auto">
                Keine Standard-Software, sondern ein ganzes KI-Ökosystem: Automatisierte Kommunikation, Lead-Pipelines,
                Telefonanlage, Trainingspläne, Growth-Analytics und mehr – alles abgestimmt auf Fitnessstudios & Coaches.
              </p>
            </RevealAnimation>
          </div>
        </div>

        {/* Service Items */}
        <div className="grid grid-cols-12 space-y-8 md:space-y-0 md:gap-8 mb-10 lg:mb-18 max-w-[1010px] mx-auto">
          {/* Card 1 */}
          <RevealAnimation delay={0.5}>
            <div className="col-span-12 md:col-span-6 lg:col-span-7 p-8 rounded-[20px] bg-white dark:bg-background-6 space-y-6 sm:min-h-[288px]">
              <div className="w-full">
                <span className="ns-shape-8 text-[52px] text-secondary dark:text-accent" />
              </div>
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">Automatisierte Kommunikation auf allen Kanälen.</h5>
                <p className="max-w-[430px]">
                  Die KI übernimmt Telefon, WhatsApp, E-Mail & DMs, qualifiziert Interessenten und bucht Probetrainings
                  direkt in deinen Kalender – ohne dass deine Rezeption besetzt sein muss.
                </p>
              </div>
            </div>
          </RevealAnimation>

          {/* Card 2 */}
          <RevealAnimation delay={0.6}>
            <div className="col-span-12 md:col-span-6 lg:col-span-5 p-8 rounded-[20px] bg-white dark:bg-background-6 space-y-6 sm:min-h-[288px]">
              <div className="w-full">
                <span className="ns-shape-35 text-[52px] text-secondary dark:text-accent" />
              </div>
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">Setup in Minuten – komplett ohne IT.</h5>
                <p>
                  Per Setup-Wizard verbindest du Telefonanlage, WhatsApp Business, Kalender & Postfächer – ohne Agentur
                  oder komplizierte Technik. Dein Studio ist sofort einsatzbereit.
                </p>
              </div>
            </div>
          </RevealAnimation>

          {/* Card 3 */}
          <RevealAnimation delay={0.7}>
            <div className="col-span-12 md:col-span-6 lg:col-span-5 p-8 rounded-[20px] bg-white dark:bg-background-6 space-y-6 sm:min-h-[288px]">
              <div className="w-full">
                <span className="ns-shape-41 text-[52px] text-secondary dark:text-accent" />
              </div>
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">Mehr Module als jede klassische Software.</h5>
                <p className="max-w-[430px]">
                  KI-Rezeption, Telefon, Lead-Funnel, Trainingspläne, Content-Ideen, Growth-Analytics – statt fünf Tools
                  eine Plattform, die alles vereint und miteinander verbindet.
                </p>
              </div>
            </div>
          </RevealAnimation>

          {/* Card 4 */}
          <RevealAnimation delay={0.8}>
            <div className="col-span-12 md:col-span-6 lg:col-span-7 p-8 rounded-[20px] bg-white dark:bg-background-6 space-y-6 sm:min-h-[288px]">
              <div className="w-full">
                <span className="ns-shape-19 text-[52px] text-secondary dark:text-accent" />
              </div>
              <div className="space-y-2">
                <h5 className="max-sm:text-heading-6">Klare Preise, volle Flexibilität.</h5>
                <p className="max-w-[430px]">
                  Basic, Pro oder Elite – und später per Add-ons erweiterbar. Kein Agenturprojekt, keine versteckten
                  Kosten, keine Laufzeiten. Du kontrollierst deinen Plan jederzeit selbst.
                </p>
              </div>
            </div>
          </RevealAnimation>
        </div>

        {/* CTA */}
        <RevealAnimation delay={0.9}>
          <div className="flex items-center justify-center">
            <LinkButton
              href="/signup-01"
              className="btn btn-secondary hover:btn-primary dark:btn-transparent dark:border-primary-50 btn-md w-[85%] md:w-auto mx-auto"
            >
              Jetzt starten
            </LinkButton>
          </div>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default Services;
