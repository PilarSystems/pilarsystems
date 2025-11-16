// src/app/dashboard/page.tsx
import NavbarOne from '@/components/shared/header/NavbarOne';
import FooterThree from '@/components/shared/footer/FooterThree';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Dashboard – Pilar Systems',
};

const DashboardPage = async () => {
  const supabase = await createSupabaseServerClient();

  // 🔐 Sicherstellen, dass nur eingeloggte Nutzer das Dashboard sehen
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // nicht eingeloggt → zum Login, danach wieder zurück ins Dashboard
    redirect('/login-01?redirectTo=/dashboard');
  }

  // Optional: Name aus Metadata
  const firstName =
    (user.user_metadata && (user.user_metadata.firstName as string | undefined)) ||
    user.email?.split('@')[0] ||
    'Pilar Kunde';

  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 backdrop-blur-[25px] dark:border-stroke-6 dark:bg-background-9"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />

      <main className="bg-background-3 dark:bg-background-7 min-h-screen">
        {/* Header / Welcome */}
        <section className="max-w-[1200px] mx-auto px-5 md:px-6 lg:px-10 xl:px-16 py-10 md:py-14 lg:py-16">
          <div className="mb-8 space-y-3">
            <span className="badge badge-cyan-v2">Pilar Dashboard</span>
            <h1 className="text-heading-3 md:text-heading-2">
              Willkommen zurück, {firstName}
            </h1>
            <p className="text-secondary/70 dark:text-accent/70 text-tagline-1 max-w-2xl">
              Hier siehst du alles, was deine KI-Rezeption erledigt: Leads, Termine
              und Konversationen – übersichtlich, in Echtzeit und bereit zum Skalieren.
            </p>
          </div>

          {/* Grid: Links Kennzahlen, rechts „Heute im Studio“ */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
            {/* Kennzahlen / Cards */}
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90 px-5 py-4 shadow-[0_0_30px_rgba(15,23,42,0.5)]">
                  <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">
                    Neue Leads (heute)
                  </p>
                  <p className="text-heading-4 mt-1">—</p>
                  <p className="text-tagline-3 text-secondary/60 dark:text-accent/60 mt-1">
                    Später: echte Zahlen aus deinen Kanälen.
                  </p>
                </div>

                <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90 px-5 py-4 shadow-[0_0_30px_rgba(15,23,42,0.5)]">
                  <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">
                    Gebuchte Termine (dieser Woche)
                  </p>
                  <p className="text-heading-4 mt-1">—</p>
                  <p className="text-tagline-3 text-secondary/60 dark:text-accent/60 mt-1">
                    Z. B. Probetrainings, Beratung, Vertragsabschlüsse.
                  </p>
                </div>

                <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90 px-5 py-4 shadow-[0_0_30px_rgba(15,23,42,0.5)]">
                  <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">
                    Offene Konversationen
                  </p>
                  <p className="text-heading-4 mt-1">—</p>
                  <p className="text-tagline-3 text-secondary/60 dark:text-accent/60 mt-1">
                    Später: Chats nach Status (neu, in Bearbeitung, abgeschlossen).
                  </p>
                </div>

                <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90 px-5 py-4 shadow-[0_0_30px_rgba(15,23,42,0.5)]">
                  <p className="text-tagline-2 text-secondary/60 dark:text-accent/60">
                    Conversion-Rate (Lead → Mitglied)
                  </p>
                  <p className="text-heading-4 mt-1">—</p>
                  <p className="text-tagline-3 text-secondary/60 dark:text-accent/60 mt-1">
                    Hier siehst du später, wie stark deine KI performt.
                  </p>
                </div>
              </div>

              {/* Platzhalter für zukünftige Charts / Funnels */}
              <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90 px-5 py-5">
                <p className="text-tagline-1 font-semibold mb-1">
                  Performance-Übersicht
                </p>
                <p className="text-tagline-2 text-secondary/70 dark:text-accent/70 mb-3">
                  Hier kommen später deine echten Charts hin: Anfragen pro Kanal,
                  Auslastung, Peak-Zeiten, Kampagnen-Funnels usw.
                </p>
                <div className="h-40 rounded-xl border border-dashed border-stroke-3 dark:border-stroke-6 flex items-center justify-center text-tagline-2 text-secondary/50 dark:text-accent/60">
                  Chart-Platzhalter · „Echte Daten“ folgen, sobald wir deine Integrationen anbinden.
                </div>
              </div>
            </div>

            {/* Right: Setup / Nächste Schritte */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-accent/40 bg-accent/5 px-5 py-5">
                <p className="text-tagline-1 uppercase tracking-[0.18em] text-accent/90 mb-1">
                  Nächste Schritte
                </p>
                <h2 className="text-heading-5 mb-3">
                  Dein Setup für die KI-Rezeption abschließen
                </h2>
                <ol className="space-y-2 text-tagline-2 text-secondary/85 dark:text-accent/85 list-decimal pl-4">
                  <li>Stimme / Persönlichkeit deiner KI in den Einstellungen wählen.</li>
                  <li>Telefonnummer, WhatsApp und E-Mail verbinden.</li>
                  <li>Studio-Regeln, Öffnungszeiten & Angebote hinterlegen.</li>
                  <li>Test-Konversation starten und Antworten feinjustieren.</li>
                </ol>
                <p className="mt-3 text-tagline-3 text-secondary/70 dark:text-accent/70">
                  Diese Schritte bauen wir als geführten Setup-Wizard direkt hier in dein
                  Dashboard ein – inklusive Fortschrittsanzeige.
                </p>
              </div>

              <div className="rounded-2xl border border-stroke-2 dark:border-stroke-6 bg-background-1/90 dark:bg-background-8/90 px-5 py-5 space-y-3">
                <p className="text-tagline-1 font-semibold">
                  Schon bald verfügbar:
                </p>
                <ul className="space-y-2 text-tagline-2 text-secondary/75 dark:text-accent/80">
                  <li>• Live-Konversationen mitlesen & jederzeit übernehmen</li>
                  <li>• Trainingsplan-Generator direkt aus dem Chat heraus</li>
                  <li>• Kampagnen-Auswertung: Welche Aktionen bringen die meisten Leads?</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterThree />
    </Fragment>
  );
};

export default DashboardPage;
