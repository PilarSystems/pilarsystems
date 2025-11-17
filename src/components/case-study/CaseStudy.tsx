import Image from 'next/image';
import RevealAnimation from '../animation/RevealAnimation';

const CaseStudy = () => {
  return (
    <section className="pt-7 pb-[20px] lg:pb-[100px]">
      <div className="main-container">
        <div className="space-y-[70px]">
          <div className="max-w-[900px] space-y-3">
            <RevealAnimation delay={0.2}>
              <h1 className="text-heading-3 md:text-heading-2 font-normal">
                Wie führende Studios mit PILAR SYSTEMS wachsen.
              </h1>
            </RevealAnimation>
            <RevealAnimation delay={0.3}>
              <p>
                Von Boutique-Gyms bis zu Studios mit mehreren Standorten: PILAR SYSTEMS hilft dabei, Anfragen,
                Probetrainings, Verträge und Check-ins zu strukturieren. Hier siehst du Beispiele, wie unsere
                KI-Infrastruktur den Alltag im Studio messbar verändert.
              </p>
            </RevealAnimation>
          </div>

          <div className="space-y-4">
            <RevealAnimation delay={0.4}>
              <h2 className="text-heading-4">Beispiel-Case</h2>
            </RevealAnimation>
            <ul className="max-w-[435px] space-y-2">
              <RevealAnimation delay={0.5}>
                <li className="text-lg font-medium leading-[150%] text-secondary dark:text-accent">
                  Kunde:{' '}
                  <span className="text-tagline-1 text-secondary/60 dark:text-accent/60 font-normal">
                    PulseGym Hamburg
                  </span>
                </li>
              </RevealAnimation>
              <RevealAnimation delay={0.6}>
                <li className="text-lg font-medium leading-[150%] text-secondary dark:text-accent">
                  Branche:{' '}
                  <span className="text-tagline-1 text-secondary/60 dark:text-accent/60 font-normal">
                    Fitnessstudio &amp; Personal Training
                  </span>
                </li>
              </RevealAnimation>
              <RevealAnimation delay={0.7}>
                <li className="text-lg font-medium leading-[150%] text-secondary dark:text-accent">
                  Use Case:{' '}
                  <span className="text-tagline-1 text-secondary/60 dark:text-accent/60 font-normal">
                    Automatisierte Lead-Betreuung, Terminbuchung &amp; Follow-ups für Probetrainings
                  </span>
                </li>
              </RevealAnimation>
            </ul>
          </div>

          <RevealAnimation delay={0.8}>
            <figure className="max-w-[1288px] rounded-4xl overflow-hidden">
              <Image
                src="/images/case-study/case-study-img-01.png"
                alt="Dashboard-Ansicht einer PILAR SYSTEMS Implementierung im Studio"
                width={1290}
                height={800}
                className="w-full h-full object-cover"
              />
            </figure>
          </RevealAnimation>

          <div className="space-y-1">
            <RevealAnimation delay={0.1}>
              <h3 className="text-heading-4">Die Ausgangssituation</h3>
            </RevealAnimation>
            <RevealAnimation delay={0.2}>
              <p className="max-w-[705px]">
                Das Studio kämpfte mit verpassten Anrufen, ungeordneten WhatsApp-Chats und manueller Terminvergabe.
                Probetrainings wurden zwar angefragt, aber viele Leads sind im Alltag untergegangen – gerade zu
                Stoßzeiten an der Theke.
              </p>
            </RevealAnimation>
          </div>

          <div className="flex items-center flex-col md:flex-row gap-16 justify-between">
            <div className="space-y-6">
              <div>
                <RevealAnimation delay={0.3}>
                  <h4 className="text-heading-4">Die Lösung</h4>
                </RevealAnimation>
                <RevealAnimation delay={0.4}>
                  <p>PILAR SYSTEMS hat im Studio:</p>
                </RevealAnimation>
              </div>
              <ul className="space-y-2">
                <RevealAnimation delay={0.3}>
                  <li>
                    <p className="before:content-[''] before:size-2 before:bg-secondary dark:before:bg-accent before:rounded-full before:inline-block before:mr-3">
                      Alle Anfragen (Telefon, WhatsApp, E-Mail, Website) in einer KI-Inbox gebündelt
                    </p>
                  </li>
                </RevealAnimation>
                <RevealAnimation delay={0.4}>
                  <li>
                    <p className="before:content-[''] before:size-2 before:bg-secondary dark:before:bg-accent before:rounded-full before:inline-block before:mr-3">
                      Probetrainings automatisiert vergeben und mit Erinnerungen versehen
                    </p>
                  </li>
                </RevealAnimation>
                <RevealAnimation delay={0.5}>
                  <li>
                    <p className="before:content-[''] before:size-2 before:bg-secondary dark:before:bg-accent before:rounded-full before:inline-block before:mr-3">
                      Follow-ups für offene Leads über WhatsApp &amp; E-Mail aufgesetzt
                    </p>
                  </li>
                </RevealAnimation>
              </ul>
            </div>

            <div className="space-y-6">
              <div>
                <RevealAnimation delay={0.3}>
                  <h4 className="text-heading-4">Die Ergebnisse</h4>
                </RevealAnimation>
                <RevealAnimation delay={0.4}>
                  <p>Innerhalb der ersten 90 Tage:</p>
                </RevealAnimation>
              </div>
              <ul className="space-y-2">
                <RevealAnimation delay={0.3}>
                  <li>
                    <p className="before:content-[''] before:size-2 before:bg-secondary dark:before:bg-accent before:rounded-full before:inline-block before:mr-3">
                      +37% mehr erschienene Probetrainings
                    </p>
                  </li>
                </RevealAnimation>
                <RevealAnimation delay={0.4}>
                  <li>
                    <p className="before:content-[''] before:size-2 before:bg-secondary dark:before:bg-accent before:rounded-full before:inline-block before:mr-3">
                      Deutlich weniger verpasste Anrufe &amp; unbeantwortete Anfragen
                    </p>
                  </li>
                </RevealAnimation>
                <RevealAnimation delay={0.5}>
                  <li>
                    <p className="before:content-[''] before:size-2 before:bg-secondary dark:before:bg-accent before:rounded-full before:inline-block before:mr-3">
                      Klarer Überblick im Dashboard statt Zettelwirtschaft &amp; Einzel-Listen
                    </p>
                  </li>
                </RevealAnimation>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudy;
