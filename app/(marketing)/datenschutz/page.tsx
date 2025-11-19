import { Section } from '@/components/marketing/Section'

export const metadata = {
  title: 'Datenschutzerklärung - PILAR SYSTEMS',
  description: 'Datenschutzerklärung von PILAR SYSTEMS'
}

export default function DatenschutzPage() {
  return (
    <div className="bg-black min-h-screen">
      <section className="relative pt-32 pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-white mb-8">Datenschutzerklärung</h1>
          
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="space-y-8 text-gray-300">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Datenschutz auf einen Blick</h2>
                
                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Allgemeine Hinweise</h3>
                <p>
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
                  personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten 
                  sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche 
                  Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten 
                  Datenschutzerklärung.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Datenerfassung auf dieser Website</h3>
                <p className="font-semibold">Wer ist verantwortlich für die Datenerfassung auf dieser Website?</p>
                <p>
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen 
                  Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
                </p>

                <p className="font-semibold mt-4">Wie erfassen wir Ihre Daten?</p>
                <p>
                  Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann 
                  es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                </p>
                <p className="mt-4">
                  Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website 
                  durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. 
                  Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser 
                  Daten erfolgt automatisch, sobald Sie diese Website betreten.
                </p>

                <p className="font-semibold mt-4">Wofür nutzen wir Ihre Daten?</p>
                <p>
                  Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu 
                  gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
                </p>

                <p className="font-semibold mt-4">Welche Rechte haben Sie bezüglich Ihrer Daten?</p>
                <p>
                  Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck 
                  Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, 
                  die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur 
                  Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft 
                  widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung 
                  der Verarbeitung Ihrer personenbezogenen Daten zu verlangen. Des Weiteren steht Ihnen ein 
                  Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
                </p>
                <p className="mt-4">
                  Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der 
                  im Impressum angegebenen Adresse an uns wenden.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Hosting</h2>
                <p>
                  Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Vercel</h3>
                <p>
                  Anbieter ist die Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA (nachfolgend 
                  „Vercel").
                </p>
                <p className="mt-4">
                  Vercel ist ein Dienst zum Hosten von Webseiten. Wenn Sie unsere Website besuchen, erfasst 
                  Vercel verschiedene Logfiles inklusive Ihrer IP-Adressen.
                </p>
                <p className="mt-4">
                  Weitere Informationen entnehmen Sie der Datenschutzerklärung von Vercel:{' '}
                  <a href="https://vercel.com/legal/privacy-policy" className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">
                    https://vercel.com/legal/privacy-policy
                  </a>
                </p>
                <p className="mt-4">
                  Die Verwendung von Vercel erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Wir haben 
                  ein berechtigtes Interesse an einer möglichst zuverlässigen Darstellung unserer Website.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>
                
                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Datenschutz</h3>
                <p>
                  Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir 
                  behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen 
                  Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                </p>
                <p className="mt-4">
                  Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben. 
                  Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können. 
                  Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir 
                  sie nutzen. Sie erläutert auch, wie und zu welchem Zweck das geschieht.
                </p>
                <p className="mt-4">
                  Wir weisen darauf hin, dass die Datenübertragung im Internet (z. B. bei der Kommunikation 
                  per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem 
                  Zugriff durch Dritte ist nicht möglich.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Hinweis zur verantwortlichen Stelle</h3>
                <p>
                  Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
                </p>
                <p className="mt-4">
                  PILAR SYSTEMS GmbH<br />
                  Musterstraße 123<br />
                  10115 Berlin<br />
                  Deutschland
                </p>
                <p className="mt-4">
                  Telefon: +49 (0) 123 456 78<br />
                  E-Mail: hello@pilarsystems.com
                </p>
                <p className="mt-4">
                  Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder 
                  gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen 
                  Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Speicherdauer</h3>
                <p>
                  Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt 
                  wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die 
                  Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder 
                  eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern 
                  wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen 
                  Daten haben (z. B. steuer- oder handelsrechtliche Aufbewahrungsfristen); im 
                  letztgenannten Fall erfolgt die Löschung nach Fortfall dieser Gründe.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
                <p>
                  Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. 
                  Sie können eine bereits erteilte Einwilligung jederzeit widerrufen. Die Rechtmäßigkeit 
                  der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Auskunft, Löschung und Berichtigung</h3>
                <p>
                  Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf 
                  unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft 
                  und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung 
                  oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema personenbezogene 
                  Daten können Sie sich jederzeit an uns wenden.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Datenerfassung auf dieser Website</h2>
                
                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Cookies</h3>
                <p>
                  Unsere Internetseiten verwenden so genannte „Cookies". Cookies sind kleine Textdateien 
                  und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für 
                  die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem 
                  Endgerät gespeichert. Session-Cookies werden nach Ende Ihres Besuchs automatisch gelöscht. 
                  Permanente Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese selbst löschen 
                  oder eine automatische Löschung durch Ihren Webbrowser erfolgt.
                </p>
                <p className="mt-4">
                  Cookies können von uns (First-Party-Cookies) oder von Drittunternehmen stammen 
                  (sog. Third-Party-Cookies). Third-Party-Cookies ermöglichen die Einbindung bestimmter 
                  Dienstleistungen von Drittunternehmen innerhalb von Webseiten (z. B. Cookies zur 
                  Abwicklung von Zahlungsdienstleistungen).
                </p>

                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Kontaktformular</h3>
                <p>
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem 
                  Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung 
                  der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben 
                  wir nicht ohne Ihre Einwilligung weiter.
                </p>
                <p className="mt-4">
                  Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, 
                  sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung 
                  vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die 
                  Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns 
                  gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung 
                  (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde.
                </p>
                <p className="mt-4">
                  Die von Ihnen im Kontaktformular eingegebenen Daten verbleiben bei uns, bis Sie uns zur 
                  Löschung auffordern, Ihre Einwilligung zur Speicherung widerrufen oder der Zweck für die 
                  Datenspeicherung entfällt (z. B. nach abgeschlossener Bearbeitung Ihrer Anfrage). 
                  Zwingende gesetzliche Bestimmungen – insbesondere Aufbewahrungsfristen – bleiben unberührt.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Plugins und Tools</h2>
                
                <h3 className="text-xl font-semibold text-white mb-3 mt-6">Google Fonts (lokales Hosting)</h3>
                <p>
                  Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten so genannte Google Fonts, 
                  die von Google bereitgestellt werden. Die Google Fonts sind lokal installiert. Eine 
                  Verbindung zu Servern von Google findet dabei nicht statt.
                </p>
                <p className="mt-4">
                  Weitere Informationen zu Google Fonts finden Sie unter{' '}
                  <a href="https://developers.google.com/fonts/faq" className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">
                    https://developers.google.com/fonts/faq
                  </a>{' '}
                  und in der Datenschutzerklärung von Google:{' '}
                  <a href="https://policies.google.com/privacy" className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">
                    https://policies.google.com/privacy
                  </a>
                </p>
              </div>

              <div className="mt-8 p-6 rounded-xl bg-gray-900 border border-gray-800">
                <p className="text-sm text-gray-400">
                  Stand: November 2025<br />
                  Diese Datenschutzerklärung wurde mit Hilfe des Datenschutz-Generators erstellt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
