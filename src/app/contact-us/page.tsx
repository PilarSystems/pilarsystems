import FooterOne from '@/components/shared/footer/FooterOne';
import NavbarOne from '@/components/shared/header/NavbarOne';
import PageHero from '@/components/shared/PageHero';
import RevealAnimation from '@/components/animation/RevealAnimation';
import { defaultMetadata } from '@/utils/generateMetaData';
import type { Metadata } from 'next';
import { Fragment } from 'react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Kontakt & Elite-Anfrage – PILAR SYSTEMS',
  description:
    'Nimm Kontakt zu PILAR SYSTEMS auf oder sende eine Anfrage für den Elite-Plan, Multi-Location-Setups oder White-Label-Lösungen für dein Studio.',
};

const ContactUsPage = () => {
  return (
    <Fragment>
      <NavbarOne
        className="border border-stroke-2 bg-accent/60 dark:border-stroke-6 dark:bg-background-9 backdrop-blur-[25px]"
        btnClassName="btn-primary hover:btn-secondary dark:hover:btn-accent"
      />
      <main className="bg-background-3 dark:bg-background-7">
        <PageHero
          title="Kontakt & Elite-Anfrage"
          heading="Sprich mit uns über dein Studio, Ketten-Setup oder Elite-Plan."
          className="pt-24 md:pt-36 lg:pt-40 xl:pt-[200px]"
          link="/contact-us"
        />

        <section className="py-16 md:py-20">
          <div className="main-container grid grid-cols-12 gap-y-12 gap-x-10">
            {/* Text / Info-Spalte */}
            <div className="col-span-12 lg:col-span-5 space-y-8">
              <RevealAnimation delay={0.2}>
                <span className="badge badge-cyan mb-2">Kontakt</span>
              </RevealAnimation>
              <RevealAnimation delay={0.25}>
                <h2 className="text-heading-3">
                  Für Studios, Ketten & Partner, die mit PILAR skalieren wollen.
                </h2>
              </RevealAnimation>
              <RevealAnimation delay={0.3}>
                <p className="text-tagline-1 text-secondary/80 dark:text-accent/80">
                  Egal, ob du mit einem Standort startest oder bereits mehrere Studios betreibst – hier kannst du mit
                  uns über den Elite-Plan, Multi-Location-Setups, White-Label oder eine engere Partnerschaft sprechen.
                  Wir melden uns in der Regel innerhalb von 24 Stunden.
                </p>
              </RevealAnimation>

              <RevealAnimation delay={0.35}>
                <div className="rounded-2xl border border-stroke-2/70 dark:border-stroke-6/70 bg-background-1/80 dark:bg-background-8/80 px-5 py-4 space-y-3">
                  <p className="text-tagline-2 uppercase tracking-[0.16em] text-secondary/60 dark:text-accent/70">
                    Typische Themen
                  </p>
                  <ul className="list-disc list-inside text-tagline-1 text-secondary/80 dark:text-accent/80 space-y-1.5">
                    <li>Elite-Plan: KI-Coach, Growth-Analytics, Multi-Location</li>
                    <li>White-Label-Optionen & eigene Markenwelten</li>
                    <li>Anbindung mehrerer Standorte & bestehender Systeme</li>
                    <li>Affiliate- & Vertriebspartnerschaften mit PILAR SYSTEMS</li>
                  </ul>
                </div>
              </RevealAnimation>

              <RevealAnimation delay={0.4}>
                <div className="space-y-1 text-tagline-1 text-secondary/80 dark:text-accent/80">
                  <p className="font-medium">Direkter Kontakt</p>
                  <p>
                    E-Mail:{' '}
                    <a
                      href="mailto:support@pilarsystems.com"
                      className="underline underline-offset-4 hover:text-secondary dark:hover:text-accent"
                    >
                      support@pilarsystems.com
                    </a>
                  </p>
                </div>
              </RevealAnimation>
            </div>

            {/* Formular-Spalte */}
            <div className="col-span-12 lg:col-span-7">
              <RevealAnimation delay={0.3}>
                <div className="rounded-3xl border border-stroke-2/70 dark:border-stroke-6/80 bg-background-1/90 dark:bg-background-8/90 px-6 py-7 md:px-8 md:py-8">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-tagline-1 text-secondary/80 dark:text-accent/80" htmlFor="name">
                          Dein Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          className="w-full rounded-xl border border-stroke-2/70 dark:border-stroke-6/80 bg-background-1/80 dark:bg-background-9/80 px-3 py-2.5 text-tagline-1 outline-none focus:ring-2 focus:ring-accent/70"
                          placeholder="Max Mustermann"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-tagline-1 text-secondary/80 dark:text-accent/80" htmlFor="studio">
                          Studio / Unternehmen
                        </label>
                        <input
                          id="studio"
                          name="studio"
                          type="text"
                          className="w-full rounded-xl border border-stroke-2/70 dark:border-stroke-6/80 bg-background-1/80 dark:bg-background-9/80 px-3 py-2.5 text-tagline-1 outline-none focus:ring-2 focus:ring-accent/70"
                          placeholder="Studio-Name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-tagline-1 text-secondary/80 dark:text-accent/80" htmlFor="email">
                          E-Mail
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          className="w-full rounded-xl border border-stroke-2/70 dark:border-stroke-6/80 bg-background-1/80 dark:bg-background-9/80 px-3 py-2.5 text-tagline-1 outline-none focus:ring-2 focus:ring-accent/70"
                          placeholder="studio@example.com"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-tagline-1 text-secondary/80 dark:text-accent/80" htmlFor="phone">
                          Telefonnummer (optional)
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          className="w-full rounded-xl border border-stroke-2/70 dark:border-stroke-6/80 bg-background-1/80 dark:bg-background-9/80 px-3 py-2.5 text-tagline-1 outline-none focus:ring-2 focus:ring-accent/70"
                          placeholder="+49 ..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-tagline-1 text-secondary/80 dark:text-accent/80" htmlFor="location">
                          Standort(e)
                        </label>
                        <input
                          id="location"
                          name="location"
                          type="text"
                          className="w-full rounded-xl border border-stroke-2/70 dark:border-stroke-6/80 bg-background-1/80 dark:bg-background-9/80 px-3 py-2.5 text-tagline-1 outline-none focus:ring-2 focus:ring-accent/70"
                          placeholder="z. B. Hamburg, 2 Standorte"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-tagline-1 text-secondary/80 dark:text-accent/80" htmlFor="interest">
                          Interesse
                        </label>
                        <select
                          id="interest"
                          name="interest"
                          className="w-full rounded-xl border border-stroke-2/70 dark:border-stroke-6/80 bg-background-1/80 dark:bg-background-9/80 px-3 py-2.5 text-tagline-1 outline-none focus:ring-2 focus:ring-accent/70"
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Bitte auswählen
                          </option>
                          <option value="elite">Elite-Plan (KI-Coach, Growth, Multi-Location)</option>
                          <option value="multi-location">Multi-Location / Ketten-Setup</option>
                          <option value="white-label">White-Label / eigene Marke</option>
                          <option value="integration">Integration & individuelle Anbindung</option>
                          <option value="partner">Affiliate- / Vertriebspartnerschaft</option>
                          <option value="other">Allgemeine Anfrage</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-tagline-1 text-secondary/80 dark:text-accent/80" htmlFor="message">
                        Worum geht es konkret?
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className="w-full rounded-xl border border-stroke-2/70 dark:border-stroke-6/80 bg-background-1/80 dark:bg-background-9/80 px-3 py-2.5 text-tagline-1 outline-none focus:ring-2 focus:ring-accent/70 resize-none"
                        placeholder="Beschreibe kurz dein Studio, eure aktuelle Situation und was du mit PILAR erreichen möchtest."
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <input
                          id="privacy"
                          name="privacy"
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-stroke-2/80 dark:border-stroke-6/80 bg-background-1/80 dark:bg-background-9/80"
                        />
                        <label
                          htmlFor="privacy"
                          className="text-[12px] text-secondary/70 dark:text-accent/70 leading-relaxed"
                        >
                          Ich habe die{' '}
                          <a
                            href="/privacy"
                            className="underline underline-offset-4 hover:text-secondary dark:hover:text-accent"
                          >
                            Datenschutzhinweise
                          </a>{' '}
                          zur Kenntnis genommen und bin einverstanden, dass meine Angaben zur Kontaktaufnahme und
                          Bearbeitung der Anfrage gespeichert und verarbeitet werden.
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary hover:btn-secondary dark:hover:btn-accent w-full md:w-auto"
                      >
                        Anfrage senden
                      </button>

                      <p className="text-[12px] text-secondary/60 dark:text-accent/60">
                        Hinweis: Dieses Formular dient aktuell als Kontaktaufnahme. Die technische Verarbeitung (z. B.
                        Versand per E-Mail oder in ein CRM) kannst du später nach Bedarf anbinden.
                      </p>
                    </div>
                  </form>
                </div>
              </RevealAnimation>
            </div>
          </div>
        </section>
      </main>
      <FooterOne />
    </Fragment>
  );
};

export default ContactUsPage;
