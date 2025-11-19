import { Section } from '@/components/marketing/Section'

export const metadata = {
  title: 'AGB - PILAR SYSTEMS',
  description: 'Allgemeine Geschäftsbedingungen von PILAR SYSTEMS'
}

export default function AGBPage() {
  return (
    <div className="bg-black min-h-screen">
      <section className="relative pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-white mb-8">Allgemeine Geschäftsbedingungen (AGB)</h1>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="space-y-8 text-gray-300">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">§ 1 Geltungsbereich</h2>
                <p>
                  (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für alle 
                  Verträge über die Nutzung der Software-as-a-Service-Plattform „PILAR SYSTEMS" 
                  (nachfolgend „Plattform") zwischen der PILAR SYSTEMS GmbH (nachfolgend „Anbieter") 
                  und dem Kunden.
                </p>
                <p className="mt-4">
                  (2) Abweichende, entgegenstehende oder ergänzende Allgemeine Geschäftsbedingungen des 
                  Kunden werden nur dann und insoweit Vertragsbestandteil, als der Anbieter ihrer Geltung 
                  ausdrücklich schriftlich zugestimmt hat.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">§ 2 Vertragsgegenstand</h2>
                <p>
                  (1) Der Anbieter stellt dem Kunden die Plattform zur Automatisierung von 
                  Fitnessstudio-Prozessen zur Verfügung. Die Plattform umfasst unter anderem:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>AI Phone Rezeption</li>
                  <li>WhatsApp AI Automation</li>
                  <li>Email Automation</li>
                  <li>Lead Engine & CRM</li>
                  <li>Calendar Integration</li>
                  <li>Analytics & Reporting</li>
                </ul>
                <p className="mt-4">
                  (2) Der konkrete Leistungsumfang ergibt sich aus dem gewählten Tarif (Basic oder Pro) 
                  und der Leistungsbeschreibung auf der Website des Anbieters.
                </p>
                <p className="mt-4">
                  (3) Der Anbieter schuldet keine bestimmte Verfügbarkeit der Plattform. Der Anbieter 
                  bemüht sich jedoch um eine möglichst hohe Verfügbarkeit.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">§ 3 Vertragsschluss</h2>
                <p>
                  (1) Der Vertragsschluss erfolgt durch Registrierung des Kunden auf der Plattform und 
                  anschließende Buchung eines Tarifs.
                </p>
                <p className="mt-4">
                  (2) Mit der Registrierung gibt der Kunde ein verbindliches Angebot zum Abschluss eines 
                  Nutzungsvertrags ab. Der Anbieter nimmt das Angebot durch Freischaltung des Zugangs an.
                </p>
                <p className="mt-4">
                  (3) Der Vertragstext wird vom Anbieter gespeichert und dem Kunden nach Vertragsschluss 
                  per E-Mail zugesandt.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">§ 4 Preise und Zahlung</h2>
                <p>
                  (1) Es gelten die zum Zeitpunkt der Bestellung auf der Website angegebenen Preise. 
                  Alle Preise verstehen sich zzgl. der gesetzlichen Umsatzsteuer.
                </p>
                <p className="mt-4">
                  (2) Die Abrechnung erfolgt monatlich im Voraus. Die erste Zahlung umfasst zusätzlich 
                  die einmalige Setup-Gebühr.
                </p>
                <p className="mt-4">
                  (3) Die Zahlung erfolgt per Kreditkarte, SEPA-Lastschrift oder Rechnung (ab Pro-Tarif).
                </p>
                <p className="mt-4">
                  (4) Bei Zahlungsverzug ist der Anbieter berechtigt, den Zugang zur Plattform zu sperren.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">§ 5 Vertragslaufzeit und Kündigung</h2>
                <p>
                  (1) Der Vertrag wird auf unbestimmte Zeit geschlossen.
                </p>
                <p className="mt-4">
                  (2) Nach Ablauf des ersten Monats kann der Vertrag von beiden Parteien mit einer Frist 
                  von 30 Tagen zum Monatsende gekündigt werden.
                </p>
                <p className="mt-4">
                  (3) Die Kündigung bedarf der Textform (z. B. E-Mail).
                </p>
                <p className="mt-4">
                  (4) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
                </p>
                <p className="mt-4">
                  (5) Bei Kündigung werden die Daten des Kunden nach 90 Tagen gelöscht. Die Setup-Gebühr 
                  wird nicht erstattet.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">§ 6 Pflichten des Kunden</h2>
                <p>
                  (1) Der Kunde ist verpflichtet, seine Zugangsdaten geheim zu halten und vor dem Zugriff 
                  Dritter zu schützen.
                </p>
                <p className="mt-4">
                  (2) Der Kunde ist verpflichtet, die Plattform nur im Rahmen der gesetzlichen Bestimmungen 
                  zu nutzen.
                </p>
                <p className="mt-4">
                  (3) Der Kunde stellt den Anbieter von allen Ansprüchen Dritter frei, die aus einer 
                  rechtswidrigen Nutzung der Plattform durch den Kunden resultieren.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">§ 7 Datenschutz</h2>
                <p>
                  (1) Der Anbieter verarbeitet personenbezogene Daten des Kunden im Rahmen der 
                  Datenschutz-Grundverordnung (DSGVO).
                </p>
                <p className="mt-4">
                  (2) Nähere Informationen zum Datenschutz finden sich in der Datenschutzerklärung des 
                  Anbieters.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">§ 8 Gewährleistung</h2>
                <p>
                  (1) Der Anbieter gewährleistet, dass die Plattform die vertraglich vereinbarte 
                  Beschaffenheit aufweist und frei von Rechts- und Sachmängeln ist.
                </p>
                <p className="mt-4">
                  (2) Bei Mängeln hat der Kunde zunächst Anspruch auf Nacherfüllung. Schlägt die 
                  Nacherfüllung fehl, kann der Kunde nach seiner Wahl Minderung verlangen oder vom 
                  Vertrag zurücktreten.
                </p>
                <p className="mt-4">
                  (3) Die Gewährleistungsfrist beträgt 12 Monate ab Vertragsschluss.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">§ 9 Haftung</h2>
                <p>
                  (1) Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie bei 
                  Verletzung von Leben, Körper oder Gesundheit.
                </p>
                <p className="mt-4">
                  (2) Bei leichter Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher 
                  Vertragspflichten (Kardinalpflichten). In diesem Fall ist die Haftung auf den 
                  vertragstypischen, vorhersehbaren Schaden begrenzt.
                </p>
                <p className="mt-4">
                  (3) Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">§ 10 Änderungen der AGB</h2>
                <p>
                  (1) Der Anbieter behält sich vor, diese AGB mit Wirkung für die Zukunft zu ändern.
                </p>
                <p className="mt-4">
                  (2) Änderungen werden dem Kunden mindestens 4 Wochen vor ihrem Inkrafttreten per E-Mail 
                  mitgeteilt. Widerspricht der Kunde der Geltung der neuen AGB nicht innerhalb von 4 Wochen 
                  nach Zugang der Mitteilung, gelten die geänderten AGB als angenommen.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">§ 11 Schlussbestimmungen</h2>
                <p>
                  (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des 
                  UN-Kaufrechts.
                </p>
                <p className="mt-4">
                  (2) Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist Berlin, sofern der 
                  Kunde Kaufmann, juristische Person des öffentlichen Rechts oder öffentlich-rechtliches 
                  Sondervermögen ist.
                </p>
                <p className="mt-4">
                  (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die 
                  Wirksamkeit der übrigen Bestimmungen hiervon unberührt.
                </p>
              </div>

              <div className="mt-8 p-6 rounded-xl bg-gray-900 border border-gray-800">
                <p className="text-sm text-gray-400">
                  Stand: November 2025<br />
                  PILAR SYSTEMS GmbH
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
