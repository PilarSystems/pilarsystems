// Affiliate-Programm Section – PILAR SYSTEMS
import affiliatesCover from '@public/images/affiliates/affiliates-cover-02.png';
import Image from 'next/image';
import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';

const AffiliateProgram = () => {
  return (
    <section className="pt-7 pb-14 md:pb-16 lg:pb-[88px] xl:pb-[100px]">
      <div className="main-container">
        <div className="space-y-14 md:space-y-[70px]">
          <RevealAnimation delay={0.1}>
            <div className="md:text-center max-w-[680px] space-y-2.5 md:space-y-3 mx-auto">
              <span className="badge badge-cyan">Affiliate-Programm</span>
              <h2>PILAR Affiliate-Programm</h2>
              <h3 className="text-heading-4">
                Verdiene wiederkehrende Provisionen mit Gyms &amp; Coaches.
              </h3>
              <p className="text-tagline-1 text-secondary/80 dark:text-accent/80">
                Du bewegst dich im Fitness-, Business- oder Marketing-Umfeld und kennst Studios, Gyms oder Coaches,
                die mehr Leads und weniger Telefonstress brauchen? Mit dem PILAR Affiliate-Programm kannst du ihnen
                helfen, ihre Infrastruktur zu modernisieren – und dir gleichzeitig einen wiederkehrenden Cashflow
                aufbauen.
              </p>
              <div className="mt-7 md:mt-10">
                <LinkButton
                  href="/contact-us?interest=affiliate"
                  className="btn btn-primary btn-xl hover:btn-secondary dark:hover:btn-accent w-full md:w-auto block md:inline-block"
                >
                  Jetzt Affiliate-Anfrage senden
                </LinkButton>
              </div>
            </div>
          </RevealAnimation>

          <RevealAnimation delay={0.2} instant>
            <figure className="max-w-full rounded-[20px] overflow-hidden">
              <Image
                src={affiliatesCover}
                className="w-full h-full object-cover object-center"
                alt="Affiliate-Partner, die mit PILAR SYSTEMS zusammenarbeiten"
              />
            </figure>
          </RevealAnimation>

          <div className="space-y-3 max-w-[830px]">
            <RevealAnimation delay={0.3}>
              <h4>Warum das PILAR Affiliate-Programm?</h4>
            </RevealAnimation>
            <RevealAnimation delay={0.4}>
              <p className="text-tagline-1 text-secondary/80 dark:text-accent/80">
                PILAR SYSTEMS ist kein One-Off-Tool, sondern die Infrastruktur für Studios: Wiederkehrende Umsätze,
                klare Use Cases und eine Zielgruppe, die jeden Monat wieder zahlt. Genau das macht Empfehlungen extrem
                wertvoll – für dich und für deine Kontakte.
              </p>
            </RevealAnimation>
            <RevealAnimation delay={0.5}>
              <ul className="space-y-2">
                <li className="text-tagline-1 text-secondary/60 dark:text-accent/60 font-normal before:relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-secondary dark:before:bg-accent before:rounded-full before:left-0 before:-translate-y-1/2 before:mr-1 before:inline-block">
                  <strong className="text-secondary dark:text-accent font-medium">
                    Wiederkehrende Provision:{' '}
                  </strong>
                  <span>
                    Du verdienst regelmäßig mit, solange ein von dir vermitteltes Studio aktiver Kunde bleibt
                    (Details klären wir individuell mit dir).
                  </span>
                </li>
                <li className="text-tagline-1 text-secondary/60 dark:text-accent/60 font-normal before:relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-secondary dark:before:bg-accent before:rounded-full before:left-0 before:-translate-y-1/2 before:mr-1 before:inline-block">
                  <strong className="text-secondary dark:text-accent font-medium">
                    Perfekt für Creator &amp; Performance-Marketer:{' '}
                  </strong>
                  <span>
                    Egal ob du mit Content, Ads, E-Mail-Listen oder persönlichen Netzwerken arbeitest – PILAR lässt
                    sich einfach und ehrlich empfehlen.
                  </span>
                </li>
                <li className="text-tagline-1 text-secondary/60 dark:text-accent/60 font-normal before:relative before:content-[''] before:w-1.5 before:h-1.5 before:bg-secondary dark:before:bg-accent before:rounded-full before:left-0 before:-translate-y-1/2 before:mr-1 before:inline-block">
                  <strong className="text-secondary dark:text-accent font-medium">
                    Klare Zielgruppe &amp; messbarer Mehrwert:{' '}
                  </strong>
                  <span>
                    Du empfiehlst kein „nice to have“, sondern eine Plattform, die Leads, Probetrainings und Abschlüsse
                    direkt nach oben zieht – das sorgt für hohe Abschlussquoten.
                  </span>
                </li>
              </ul>
            </RevealAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

AffiliateProgram.displayName = 'AffiliateProgram';
export default AffiliateProgram;
