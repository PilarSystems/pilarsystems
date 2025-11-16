import RevealAnimation from '@/components/animation/RevealAnimation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProcessFaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqItems: ProcessFaqItem[] = [
  {
    id: '1',
    question: 'Wie lange dauert das Setup mit Pilar Systems?',
    answer:
      'Die meisten Studios sind innerhalb von 1–3 Tagen startklar. Die Online-Registrierung dauert nur wenige Minuten, der Setup-Wizard führt dich Schritt für Schritt durch alle Fragen und die Anbindung deiner Kanäle erledigen wir gemeinsam mit dir – komplett remote.',
  },
  {
    id: '2',
    question: 'Brauche ich technisches Vorwissen oder eine eigene IT-Abteilung?',
    answer:
      'Nein. Pilar Systems ist so gebaut, dass Studios ohne IT-Team starten können. Du beantwortest Fragen im Setup-Wizard, wir stellen dir klare Anleitungen zur Verfügung und begleiten dich beim Verbinden von Telefon, WhatsApp, E-Mail und Kalender.',
  },
  {
    id: '3',
    question: 'Wie funktioniert die Verbindung meiner Telefonanlage und WhatsApp-Nummer?',
    answer:
      'Je nach Anbieter richten wir entweder eine Weiterleitung ein oder binden deine bestehende Nummer über unsere Partner an. Für WhatsApp verwenden wir eine offizielle Schnittstelle, damit alles DSGVO-konform bleibt. Den technischen Teil begleiten wir mit klaren Schritten, du musst nichts selbst programmieren.',
  },
  {
    id: '4',
    question: 'Was passiert, wenn ich mehrere Standorte habe?',
    answer:
      'Mit dem Elite-Plan kannst du mehrere Standorte und Marken in einem Account verwalten. Du legst für jeden Standort eigene Regeln, Angebote und Öffnungszeiten fest – die KI erkennt automatisch, wohin eine Anfrage gehört.',
  },
  {
    id: '5',
    question: 'Kann ich später von Basic auf Pro oder Elite upgraden?',
    answer:
      'Ja. Du kannst jederzeit deinen Plan upgraden und zusätzliche Module wie Voice, Coach, Creator oder White-Label hinzubuchen. Deine bestehenden Daten und Prozesse bleiben dabei erhalten – du schaltest einfach mehr Funktionen frei.',
  },
];

const ProcessFaq = () => {
  return (
    <section className="md:pt-[100px] pt-[50px] md:pb-[200px] pb-[100px]">
      <div className="main-container">
        <div className="text-center space-y-5 max-w-[620px] mx-auto mb-[70px]">
          <RevealAnimation delay={0.1}>
            <span className="badge badge-cyan">FAQ zum Ablauf</span>
          </RevealAnimation>
          <div className="space-y-3">
            <RevealAnimation delay={0.2}>
              <h2>Häufige Fragen zum Start mit Pilar Systems.</h2>
            </RevealAnimation>
            <RevealAnimation delay={0.3}>
              <p>
                Hier findest du Antworten auf die wichtigsten Fragen rund um Setup, Technik, Laufzeit und
                Mehr-Standort-Betrieb. Wenn noch etwas offen bleibt, kannst du uns jederzeit direkt kontaktieren.
              </p>
            </RevealAnimation>
          </div>
        </div>

        <RevealAnimation delay={0.4}>
          <Accordion
            className="sm:max-w-[850px] max-w-full sm:mx-auto space-y-4"
            defaultValue="1"
            animationDelay={0.1}
          >
            {faqItems.map((faq) => (
              <AccordionItem
                key={faq.id}
                className="bg-background-1 dark:bg-background-6 rounded-[20px] sm:px-8 px-6"
                value={faq.id}
              >
                <AccordionTrigger
                  titleClassName="flex-1 text-left sm:text-heading-6 text-tagline-1 font-normal text-secondary dark:text-accent"
                  className="flex items-center cursor-pointer justify-between sm:pt-8 pt-6 sm:pb-8 pb-6 w-full"
                  value={faq.id}
                  iconType="arrow"
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent value={faq.id}>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </RevealAnimation>
      </div>
    </section>
  );
};

export default ProcessFaq;
