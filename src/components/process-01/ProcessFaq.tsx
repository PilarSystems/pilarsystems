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
    question: 'Wie lange dauert das Setup mit PILAR SYSTEMS?',
    answer:
      'Die Online-Registrierung und das Grund-Setup im Wizard dauern in der Regel nur 5–15 Minuten. Viele Studios sind damit in unter 30 Minuten so weit, dass erste Tests möglich sind. Die komplette Anbindung von Telefon, WhatsApp & Kalender erfolgt dann innerhalb von 1–3 Tagen – komplett remote, ohne wochenlange Kick-off-Calls und Agenturprojekte.',
  },
  {
    id: '2',
    question: 'Brauche ich technisches Vorwissen oder eine eigene IT-Abteilung?',
    answer:
      'Nein. PILAR SYSTEMS ist so gebaut, dass Studios ohne eigenes IT-Team starten können. Du klickst dich durch den Setup-Wizard, wir stellen dir klare Schritt-für-Schritt-Anleitungen zur Verfügung und begleiten dich bei der Verbindung von Telefon, WhatsApp, E-Mail und Kalender. Du musst nichts programmieren – und auch keine Infrastruktur selbst hosten.',
  },
  {
    id: '3',
    question: 'Wie funktioniert die Verbindung meiner Telefonanlage und WhatsApp-Nummer?',
    answer:
      'Je nach Anbieter richten wir entweder eine Weiterleitung ein oder binden deine bestehende Nummer über unsere Partner an. Für WhatsApp verwenden wir eine offizielle Schnittstelle, damit alles DSGVO-konform bleibt. Du bekommst von uns konkrete Anweisungen je nach Anbieter, wir begleiten den Prozess remote – der technische Teil wird so weit wie möglich für dich vorbereitet.',
  },
  {
    id: '4',
    question: 'Was passiert, wenn ich mehrere Standorte habe?',
    answer:
      'Mit dem Elite-Plan kannst du mehrere Standorte und Marken in einem Account verwalten. Für jeden Standort legst du eigene Öffnungszeiten, Angebote, Regeln und Ansprechpartner fest. Die KI erkennt anhand der Anfrage automatisch, zu welchem Standort sie gehört – und ordnet Leads, Termine und Auswertungen sauber zu.',
  },
  {
    id: '5',
    question: 'Kann ich später von Basic auf Pro oder Elite upgraden?',
    answer:
      'Ja. Du kannst jederzeit deinen Plan upgraden und zusätzliche Module wie Voice, Coach, Creator oder White-Label hinzubuchen. Deine bestehenden Daten, Leads und Prozesse bleiben dabei erhalten – du schaltest lediglich weitere Funktionen und Automationen frei, ohne neu starten zu müssen.',
  },
  {
    id: '6',
    question: 'Ist PILAR SYSTEMS DSGVO-konform?',
    answer:
      'Ja. Wir achten darauf, dass sämtliche genutzten Schnittstellen und Speicherorte DSGVO-konform sind. Du schließt mit uns einen Auftragsverarbeitungsvertrag (AVV) ab, erhältst klare Hinweise für deine Datenschutzerklärung und kannst jederzeit nachvollziehen, welche Daten wie verarbeitet werden.',
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
              <h2>Häufige Fragen zum Start mit PILAR SYSTEMS.</h2>
            </RevealAnimation>
            <RevealAnimation delay={0.3}>
              <p>
                Hier findest du Antworten auf die wichtigsten Fragen rund um Setup, Technik, Mehr-Standort-Betrieb und
                Datenschutz. Wenn noch etwas offen bleibt, kannst du uns jederzeit direkt kontaktieren.
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
