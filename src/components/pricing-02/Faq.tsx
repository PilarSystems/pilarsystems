import RevealAnimation from '../animation/RevealAnimation';

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: 'Gibt es eine Mindestlaufzeit?',
    answer:
      'Standardmäßig arbeiten wir mit einer monatlichen Laufzeit. Du kannst Pilar Systems also flexibel testen. Für Ketten und größere Volumina sind individuelle Laufzeiten und Rahmenverträge möglich.',
  },
  {
    question: 'Was ist in der Setup-Gebühr enthalten?',
    answer:
      'Im Setup richten wir deine KI-Rezeption ein, verbinden die relevanten Kanäle (Telefonanlage, WhatsApp, E-Mail, Webseite), passen Dialoge an dein Studio an und testen gemeinsam typische Szenarien – bis alles sauber läuft.',
  },
  {
    question: 'Für welche Studios eignet sich welcher Plan?',
    answer:
      'Starter Gym ist ideal für einzelne Studios mit einem Standort. Growth Gym richtet sich an Studios mit höherem Anfragevolumen oder 1–3 Standorten. Elite / Multi-Location ist für Ketten, Franchise-Systeme und Studios mit mehreren Standorten gedacht.',
  },
  {
    question: 'Kann ich später in einen anderen Plan wechseln?',
    answer:
      'Ja. Du kannst jederzeit mit einem kleineren Plan starten und bei wachsendem Volumen oder zusätzlichen Standorten in einen größeren Plan wechseln.',
  },
  {
    question: 'Wie funktioniert die Kündigung?',
    answer:
      'Die Kündigung ist monatlich möglich – schriftlich per E-Mail, innerhalb der im Vertrag vereinbarten Frist. Nach Ende der Laufzeit werden Zugänge deaktiviert und Daten gemäß DSGVO gelöscht oder anonymisiert.',
  },
  {
    question: 'Ist Pilar Systems DSGVO-konform?',
    answer:
      'Ja. Wir setzen auf eine DSGVO-konforme Infrastruktur, verarbeiten Daten nur im notwendigen Umfang und schließen mit dir einen Auftragsverarbeitungsvertrag (AVV) ab. Details erhältst du im Onboarding.',
  },
];

const Faq = () => {
  return (
    <section className="pt-10 md:pt-16 lg:pt-[90px] xl:pt-[100px] pb-20 md:pb-[100px] lg:pb-[120px] xl:pb-[140px] bg-background-1 dark:bg-background-6">
      <div className="main-container">
        <div className="max-w-[640px] mx-auto text-center mb-10 md:mb-[60px] space-y-3">
          <RevealAnimation delay={0.2}>
            <span className="badge badge-green">FAQ zu Preisen & Tarifen</span>
          </RevealAnimation>
          <RevealAnimation delay={0.3}>
            <h2>Häufige Fragen zu Pilar Systems.</h2>
          </RevealAnimation>
          <RevealAnimation delay={0.4}>
            <p className="text-secondary/60 dark:text-accent/60">
              Noch unsicher, welcher Plan zu deinem Studio passt? Hier sind die wichtigsten Antworten rund um Preise,
              Laufzeiten und Setup.
            </p>
          </RevealAnimation>
        </div>

        <div className="max-w-[880px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {faqItems.map((item, idx) => (
            <RevealAnimation key={item.question} delay={0.2 + idx * 0.05}>
              <div className="rounded-2xl bg-background-2 dark:bg-background-5 p-5 md:p-6 h-full">
                <h3 className="text-heading-6 mb-2">{item.question}</h3>
                <p className="text-secondary/70 dark:text-accent/70 text-sm md:text-[15px] leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </RevealAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
