# PILAR SYSTEMS - Marketing Website

Dieses Dokument beschreibt die Marketing-Website von PILAR SYSTEMS, die im November 2025 neu aufgebaut wurde.

## 📁 Struktur

Die Marketing-Website ist vollständig getrennt von der SaaS-Anwendung und nutzt Next.js Route Groups:

```
app/(marketing)/                    # Route Group (beeinflusst URLs nicht)
├── layout.tsx                      # Shared Layout (Header, Footer, Cookie Banner)
├── page.tsx                        # Homepage (/)
├── pricing/page.tsx                # Preise (/pricing)
├── features/page.tsx               # Features (/features)
├── whatsapp-coach/page.tsx         # WhatsApp Gym Buddy (/whatsapp-coach)
├── about/page.tsx                  # Über uns (/about)
├── contact/page.tsx                # Kontakt/Demo (/contact)
├── impressum/page.tsx              # Impressum (/impressum)
├── datenschutz/page.tsx            # Datenschutz (/datenschutz)
└── agb/page.tsx                    # AGB (/agb)

src/components/marketing/           # Wiederverwendbare Marketing-Komponenten
├── Header.tsx                      # Navigation mit Mobile Menu
├── Footer.tsx                      # Footer mit Links
├── CookieBanner.tsx                # Cookie Consent Banner
├── Section.tsx                     # Animated Section Wrapper
└── FeatureCard.tsx                 # Feature Card mit Hover-Effekten

public/marketing/                   # Marketing Assets (Bilder, etc.)
```

## 🎨 Design-System

### Farben
- **Background**: Schwarz (`bg-black`)
- **Primary Gradient**: Cyan → Blue (`from-cyan-500 to-blue-600`)
- **Text**: Weiß (`text-white`) und Grau (`text-gray-400`)
- **Borders**: Weiß mit Transparenz (`border-white/10`)

### Typografie
- **Font**: Inter (Google Fonts, lokal gehostet)
- **Headings**: 
  - H1: `text-5xl md:text-7xl font-bold`
  - H2: `text-4xl md:text-5xl font-bold`
  - H3: `text-2xl font-semibold`

### Animationen
- **Library**: Framer Motion 12.23.24
- **Patterns**:
  - Fade-in on scroll: `whileInView={{ opacity: 1, y: 0 }}`
  - Hover effects: `whileHover={{ scale: 1.02 }}`
  - Staggered animations mit `delay` prop

## 📄 Seiten-Übersicht

### 1. Homepage (`/`)
**Sections:**
- Hero mit Gradient Background & Animationen
- Problem → Solution Vergleich
- Product Modules (6 Kernfunktionen)
- Onboarding Flow (5 Schritte)
- Pricing Preview (Basic & Pro)
- Why PILAR (4 Werte)
- FAQ (6 Fragen)
- Final CTA

**CTAs:** Demo buchen, Features ansehen

### 2. Pricing (`/pricing`)
**Sections:**
- Hero
- Pricing Cards (Basic 100€, Pro 149€)
- WhatsApp Add-on (20€)
- Setup-Details (9 Punkte)
- FAQ (8 Fragen)
- CTA

**CTAs:** Jetzt starten, Kontakt

### 3. Features (`/features`)
**Sections:**
- Hero
- Core Features (6 Module)
- AI Phone Deep Dive
- WhatsApp Deep Dive
- Lead Engine Deep Dive
- Additional Features (4 Punkte)
- CTA

**CTAs:** Demo buchen, Preise ansehen

### 4. WhatsApp Coach (`/whatsapp-coach`)
**Sections:**
- Hero (Beta Q1 2026)
- Was ist es?
- Features (6 Punkte)
- Zwei Modelle (Direkt 9,99€ vs. Studio-Partner)
- How it Works (3 Schritte)
- CTA

**CTAs:** Frühzugang sichern, Studio-Partner werden

**Status:** 🚀 Beta-Ankündigung (Q1 2026)

### 5. About (`/about`)
**Sections:**
- Hero
- Mission
- Story (Problem → Lösung → Vision)
- Werte (4 Punkte)
- Team (Made in Germany)
- CTA

**CTAs:** Demo buchen, Kontakt

### 6. Contact (`/contact`)
**Sections:**
- Hero
- Contact Form (Name, Email, Phone, Studio, Size, Message)
- Contact Info (Email, Phone, Adresse)
- Map Placeholder
- CTA

**Form Fields:**
- Name* (required)
- E-Mail* (required)
- Telefon
- Studio Name* (required)
- Studio-Größe* (Dropdown: Klein/Mittel/Groß/Kette)
- Nachricht

**Note:** Form submission ist aktuell ein TODO (console.log). Muss noch an Backend angebunden werden.

### 7. Legal Pages

#### Impressum (`/impressum`)
- Angaben gemäß § 5 TMG
- Kontaktdaten
- Registereintrag
- Umsatzsteuer-ID
- Haftungsausschlüsse

#### Datenschutz (`/datenschutz`)
- DSGVO-konforme Datenschutzerklärung
- Hosting (Vercel)
- Cookies
- Kontaktformular
- Google Fonts (lokal)
- Rechte der Nutzer

#### AGB (`/agb`)
- Geltungsbereich
- Vertragsgegenstand
- Preise & Zahlung
- Kündigung (30 Tage)
- Gewährleistung
- Haftung

**Note:** Alle Legal Pages enthalten Platzhalter-Daten (z.B. HRB-Nummer, USt-ID). Diese müssen vor Launch mit echten Daten gefüllt werden!

## 🔧 Komponenten

### Header.tsx
- Fixed Top Navigation
- Logo (PILAR SYSTEMS)
- Desktop Menu: Home, Pricing, Features, WhatsApp Coach, About, Contact
- Mobile Hamburger Menu
- CTA Buttons: Login, Demo buchen
- Glassmorphism Effect (`backdrop-blur-xl`)

### Footer.tsx
- 3 Spalten: Produkt, Unternehmen, Legal
- Social Links (Placeholder)
- Copyright
- Alle wichtigen Links

### CookieBanner.tsx
- Client-only Component (`'use client'`)
- LocalStorage: `cookie-consent`
- Accept/Decline Buttons
- Slide-in Animation
- Link zu Datenschutz

### Section.tsx
- Wrapper für alle Sections
- Framer Motion `whileInView` Animation
- Fade-in + Slide-up Effect
- Viewport: `once: true` (nur einmal animieren)

### FeatureCard.tsx
- Icon + Title + Description
- Hover Effect (scale 1.02)
- Gradient Background
- Glow Effect on Hover
- Staggered Animation Support

## 🚀 Deployment

### Build
```bash
yarn build
```
✅ Build läuft erfolgreich durch (0 Errors)

### Dev
```bash
yarn dev
```
Öffne http://localhost:3000

### Vercel
Die Seite ist bereits auf Vercel deployed. Alle Marketing-Routes funktionieren:
- https://pilarsystems.vercel.app/
- https://pilarsystems.vercel.app/pricing
- https://pilarsystems.vercel.app/features
- etc.

## ✅ Checkliste vor Launch

### Content
- [ ] Impressum: Echte Daten eintragen (HRB, USt-ID, Geschäftsführer)
- [ ] Datenschutz: Prüfen & ggf. anpassen
- [ ] AGB: Prüfen & ggf. anpassen
- [ ] Contact Form: Backend-Integration implementieren
- [ ] Social Proof: Echte Logos auf Homepage
- [ ] Team Section: Echte Team-Infos (optional)

### Technical
- [x] Build läuft durch
- [x] Alle Routes funktionieren
- [x] Mobile Responsive
- [x] Animationen funktionieren
- [x] Cookie Banner funktioniert
- [x] Keine Console Errors
- [ ] SEO Meta Tags prüfen
- [ ] OG Images erstellen
- [ ] Sitemap generieren
- [ ] robots.txt prüfen

### Design
- [x] Dark Theme konsistent
- [x] Gradient Accents
- [x] Hover Effects
- [x] Mobile Menu
- [x] Responsive Grid Layouts
- [ ] Echte Bilder/Screenshots hinzufügen (aktuell Placeholders)

## 🎯 Nächste Schritte

1. **Content vervollständigen**
   - Legal Pages mit echten Daten füllen
   - Echte Logos & Screenshots hinzufügen
   - Team-Sektion ausbauen (optional)

2. **Backend Integration**
   - Contact Form an API anbinden
   - Newsletter-Signup implementieren (optional)
   - Analytics einbinden (Google Analytics, Plausible, etc.)

3. **SEO Optimierung**
   - Meta Descriptions für alle Seiten
   - OG Images erstellen
   - Structured Data (JSON-LD)
   - Sitemap & robots.txt

4. **Performance**
   - Bilder optimieren (next/image)
   - Lazy Loading für Below-the-Fold Content
   - Core Web Vitals prüfen

5. **A/B Testing**
   - Hero Headlines testen
   - CTA Button Texte testen
   - Pricing Display testen

## 📝 Änderungen vornehmen

### Content ändern
Alle Texte sind direkt in den Page-Komponenten. Einfach die entsprechende Datei öffnen und bearbeiten:

```tsx
// Beispiel: Homepage Hero ändern
// Datei: app/(marketing)/page.tsx

<h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
  <span className="block text-white">Dein neuer Text</span>
  <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
    hier
  </span>
</h1>
```

### Neue Seite hinzufügen
1. Ordner in `app/(marketing)/` erstellen
2. `page.tsx` erstellen
3. Layout wird automatisch übernommen
4. Link in Header/Footer hinzufügen

### Styling ändern
Alle Styles nutzen Tailwind CSS. Farben/Spacing/etc. direkt in den Komponenten ändern.

## 🐛 Bekannte Issues

1. **Contact Form**: Submission ist noch nicht implementiert (nur console.log)
2. **Social Proof**: Logos sind Placeholders
3. **Map**: Google Maps Integration fehlt noch
4. **Legal Pages**: Enthalten Platzhalter-Daten

## 📞 Support

Bei Fragen zur Marketing-Website:
- Code: Siehe Komponenten in `src/components/marketing/`
- Design: Siehe Design-System oben
- Content: Siehe Page-Komponenten in `app/(marketing)/`

---

**Erstellt:** November 2025  
**Letztes Update:** November 2025  
**Version:** 1.0.0
