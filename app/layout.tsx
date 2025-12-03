import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PILAR SYSTEMS - AI SaaS für Fitnessstudios",
  description: "Automatisiere dein Fitnessstudio mit AI. 24/7 Rezeption, Lead-Management, WhatsApp & Phone AI, Follow-Up Automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
