import { CheckIcon } from '@/icons';
import totalEarnImg from '@public/images/about-page-02/total-earn.png';
import roundImageImg from '@public/images/home-page-7/round-image.png';
import Image from 'next/image';
import RevealAnimation from '../animation/RevealAnimation';
import LinkButton from '../ui/button/LinkButton';

const principles = [
  { id: 1, label: 'Studioalltag zuerst – Technologie dahinter' },
  { id: 2, label: 'Klare Prozesse statt Feature-Overload' },
  { id: 3, label: 'Datenschutz & Sicherheit als Standard' },
];

const FinanceIntro = () => {
  return (
    <section className="py-12 md:py-32 lg:py-40 xl:py-48 2xl:py-[200px] overflow-hidden">
      <div className="main-container flex flex-col-reverse lg:flex-row items-center gap-y-12 gap-x-24">
        {/* Bild / Visual */}
        <div className="md:flex-1 relative flex justify-start w-full lg:w-auto overflow-hidden">
          <RevealAnimation delay={0.2}>
            <Image
              src={roundImageImg}
              alt="Team arbeitet mit Pilar Systems Dashboard"
              className="w-full max-w-[450px] h-auto"
            />
          </RevealAnimation>
          <RevealAnimation delay={0.3} direction="right" offset={90}>
            <div className="absolute text-heading-4 top-[49%] right-[15%] bg-ns-yellow p-4 rounded-2xl max-w-[230px] max-h-[80px] flex items-center justify-center text-center">
              <div className="text-tagline-2 font-medium">
                +87% mehr Show-ups bei Probetrainings
              </div>
            </div>
          </RevealAnimation>
          <RevealAnimation delay={0.5} direction="right" offset={100}>
            <figure className="rounded-xl max-w-[186px] w-full overflow-hidden shadow-10 absolute bottom-[15%] right-[17%] sm:block hidden">
              <Image
                src={totalEarnImg}
                alt="KPI-Karte mit Studio-Kennzahlen"
                className="size-full object-cover"
              />
            </figure>
          </RevealAnimation>
        </div>

        {/* Text / Werte */}
        <div className="md:flex-1 flex flex-col lg:items-start lg:text-left">
          <RevealAnimation delay={0.2}>
            <h2 className="mb-3">
              Warum es Pilar Systems gibt – und was wir anders machen.
            </h2>
          </RevealAnimation>
          <RevealAnimation delay={0.3}>
            <p className="mb-6">
              Pilar Systems ist nicht im Meetingraum eines Großkonzerns entstanden, sondern aus der Realität: volle
              Telefone, unbeantwortete WhatsApps, gestresste Teams und Leads, die einfach verschwinden. Wir bauen eine
              Infrastruktur, die diesen Alltag auffängt – und Studios hilft, planbar zu wachsen.
            </p>
          </RevealAnimation>
          <RevealAnimation delay={0.35}>
            <p className="mb-6">
              Unsere Werte sind dabei klar: Wir entwickeln nur Features, die im Studioalltag wirklich genutzt werden,
              machen komplexe Prozesse einfach bedienbar und achten konsequent auf Datenschutz und Datensicherheit.
            </p>
          </RevealAnimation>

          <ul className="mb-10 md:mb-14 space-y-2 md:space-y-3.5">
            {principles.map((item, idx) => (
              <RevealAnimation key={item.id} delay={0.4 + idx * 0.1}>
                <li className="text-tagline-1 font-medium flex items-center gap-3 dark:text-accent">
                  <span className="bg-secondary dark:bg-accent/10 rounded-full size-[18px] flex items-center justify-center">
                    <CheckIcon />
                  </span>
                  {item.label}
                </li>
              </RevealAnimation>
            ))}
          </ul>

          <RevealAnimation delay={0.7}>
            <div>
              <LinkButton
                href="/signup-01"
                className="btn btn-secondary hover:btn-white dark:btn-white-dark btn-xl block md:inline-block w-full md:w-auto mx-auto"
              >
                Jetzt mit Pilar starten
              </LinkButton>
            </div>
          </RevealAnimation>
        </div>
      </div>
    </section>
  );
};

export default FinanceIntro;
