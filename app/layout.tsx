import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PILAR SYSTEMS - KI-gesteuerte Automatisierung für Fitnessstudios",
  description: "Automatisiere dein Fitnessstudio mit KI: WhatsApp AI, Phone AI, Lead Management. 100% Self-Service Onboarding. Keine Einrichtungskosten.",
  keywords: ["Fitnessstudio Software", "Gym Management", "AI Automation", "WhatsApp AI", "Lead Management"],
  authors: [{ name: "PILAR SYSTEMS" }],
  creator: "PILAR SYSTEMS",
  publisher: "PILAR SYSTEMS",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: "PILAR SYSTEMS - KI-Automatisierung für Fitnessstudios",
    description: "Automatisiere dein Fitnessstudio mit KI: WhatsApp AI, Phone AI, Lead Management.",
    url: "/",
    siteName: "PILAR SYSTEMS",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PILAR SYSTEMS",
    description: "KI-gesteuerte Automatisierung für Fitnessstudios",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className="font-sans antialiased"
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
