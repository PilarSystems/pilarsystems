import vision1Img from '@public/images/about-page-02/vision-1.png';
import vision2Img from '@public/images/about-page-02/vision-2.png';
import Image from 'next/image';
import RevealAnimation from '../animation/RevealAnimation';

const VisionStatement = () => {
  return (
    <section className="pb-14 md:pb-16 lg:pb-[88px] xl:pb-[100px] pt-[100px]">
      <div className="main-container space-y-12 md:space-y-16 lg:space-y-[100px]">
        <div className="space-y-3 text-center max-w-[780px] mx-auto">
          <RevealAnimation delay={0.2}>
            <span className="badge badge-cyan mb-5">Unsere Vision</span>
          </RevealAnimation>
          <RevealAnimation delay={0.3}>
            <h2 className="font-medium">
              Weniger Chaos im Studioalltag. Mehr Fokus auf Mitglieder und Wachstum.
            </h2>
          </RevealAnimation>
          <RevealAnimation delay={0.4}>
            <p>
              PILAR SYSTEMS ist aus einem einfachen Gedanken entstanden: Studios verlieren täglich Potenzial, weil
              Telefon, WhatsApp, E-Mail, Kalender und Studio-Software nicht zusammenspielen. Unsere Vision ist eine
              KI-Infrastruktur, die Anfragen, Probetrainings, Verträge, Check-ins und Trainingsorganisation so
              intelligent verbindet, dass dein Team wieder Zeit für das Wesentliche hat – Menschen und echte Betreuung.
            </p>
          </RevealAnimation>
          <RevealAnimation delay={0.45}>
            <p>
              Statt ständig auf verpasste Anrufe, offene Chats und Excel-Listen zu reagieren, soll jedes Gym Klarheit
              über Auslastung, Leads und Wachstum haben – unabhängig von Schichtplänen, Standorten oder Größe. PILAR
              baut die Plattform, auf der moderne Gyms, Studios und Ketten weltweit ihren Vertrieb und Service skalieren.
            </p>
          </RevealAnimation>
        </div>

        <article className="flex flex-col md:flex-row gap-8">
          <RevealAnimation delay={0.5} instant={true}>
            <figure className="rounded-[20px] overflow-hidden max-w-full md:max-w-[630px]">
              <Image
                src={vision1Img}
                className="w-full h-full object-cover"
                alt="Modernes Gym mit strukturierter Organisation"
              />
            </figure>
          </RevealAnimation>
          <RevealAnimation delay={0.6} instant={true}>
            <figure className="rounded-[20px] overflow-hidden max-w-full md:max-w-[630px]">
              <Image
                src={vision2Img}
                className="w-full h-full object-cover"
                alt="Digitales Dashboard für Fitnessstudios"
              />
            </figure>
          </RevealAnimation>
        </article>
      </div>
    </section>
  );
};

export default VisionStatement;
