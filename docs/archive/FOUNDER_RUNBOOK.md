# PILAR SYSTEMS - Founder Runbook

**Version:** 1.0.0 (Production Final)  
**Date:** November 21, 2025  
**Status:** 🚀 Launch-Ready

---

## 📋 Übersicht

Dieses Dokument beschreibt **alle Aufgaben, die du als Founder nach dem Launch manuell erledigen musst**. Alles andere läuft vollautomatisch durch die Self-Service-Automation.

**Wichtig:** Studios können jetzt **komplett selbstständig**:
- ✅ Sich registrieren und bezahlen (Stripe Checkout)
- ✅ Onboarding durchlaufen (5 Schritte)
- ✅ Telefonnummer kaufen & Phone-AI einrichten (Twilio Auto-Provisioning)
- ✅ WhatsApp-Coach konfigurieren & starten
- ✅ Alle Integrationen selbst verwalten
- ✅ Als Affiliate Partner registrieren (mit Auto-Approval)

---

## 🎯 Deine Aufgaben als Founder

### 1. Provider-Accounts & ENV-Variablen verwalten

**Häufigkeit:** Einmalig beim Setup + gelegentlich bei Rotation

**Was du tun musst:**
1. Provider-Accounts erstellen (siehe SETUP_PILAR_SYSTEMS_FINAL.md)
2. ENV-Variablen in Vercel setzen
3. API Keys rotieren (empfohlen: alle 90 Tage)

**Provider-Liste:**
- ✅ **Erforderlich:** Supabase (Auth + DB), Stripe (Payments), OpenAI (AI)
- 🔸 **Optional:** Twilio (Phone AI), WhatsApp Cloud API, ElevenLabs (Voice), Google Calendar, Upstash Redis (Rate Limiting), n8n (Workflows)

**ENV-Rotation Checkliste:**
```bash
# Alle 90 Tage
- [ ] STRIPE_SECRET_KEY rotieren
- [ ] OPENAI_API_KEY rotieren
- [ ] TWILIO_AUTH_TOKEN rotieren (falls verwendet)
- [ ] WHATSAPP_API_TOKEN rotieren (falls verwendet)
- [ ] ENCRYPTION_KEY rotieren (VORSICHT: Daten neu verschlüsseln!)
```

---

### 2. Stripe Payouts & Disputes managen

**Häufigkeit:** Monatlich + bei Bedarf

**Was du tun musst:**

**Monatliche Payouts:**
1. Gehe zu [Stripe Dashboard](https://dashboard.stripe.com) → Payouts
2. Überprüfe automatische Auszahlungen
3. Bei Problemen: Bankverbindung prüfen

**Disputes (Rückbuchungen):**
1. Gehe zu Stripe Dashboard → Disputes
2. Prüfe Grund der Rückbuchung
3. Entscheide: Akzeptieren oder Anfechten
4. Bei Anfechten: Beweise hochladen (Nutzungslogs, E-Mails, etc.)

**Affiliate-Provisionen:**
1. Gehe zu `/dashboard/admin/affiliates` (Admin-Dashboard)
2. Überprüfe fällige Provisionen
3. Markiere als "ausgezahlt" nach manueller Überweisung
4. Oder: Automatisiere mit Stripe Connect (zukünftig)

---

### 3. Support-Mails beantworten

**Häufigkeit:** Täglich

**Was du tun musst:**
1. Checke `support@pilarsystems.com` (oder deine CONTACT_TO Email)
2. Beantworte Anfragen von Studios
3. Typische Fragen:
   - "Wie richte ich WhatsApp ein?" → Link zu /dashboard/whatsapp-coach
   - "Meine Telefonnummer funktioniert nicht" → Twilio Logs prüfen
   - "Ich kann mich nicht einloggen" → Supabase Auth Logs prüfen
   - "Rechnung benötigt" → Stripe Customer Portal Link senden

**Support-Ressourcen:**
- Vercel Logs: https://vercel.com/pilars-projects-e4c42fac/pilarsystems
- Supabase Dashboard: https://supabase.com/dashboard
- Stripe Dashboard: https://dashboard.stripe.com
- Twilio Console: https://console.twilio.com

---

### 4. Logs & Error-Tracking überwachen

**Häufigkeit:** Täglich (erste Woche), dann wöchentlich

**Was du tun musst:**

**Vercel Logs prüfen:**
1. Gehe zu [Vercel Dashboard](https://vercel.com/pilars-projects-e4c42fac/pilarsystems)
2. Klicke auf "Logs"
3. Filtere nach "error" oder "warn"
4. Prüfe kritische Fehler:
   - 500 Internal Server Error → Code-Bug, sofort fixen
   - 429 Rate Limit → Upstash Redis aktivieren oder Limits erhöhen
   - Stripe Webhook Fehler → Webhook Secret prüfen
   - Twilio API Fehler → Guthaben prüfen, Credentials prüfen

**Supabase Logs prüfen:**
1. Gehe zu Supabase Dashboard → Logs
2. Prüfe Auth-Fehler
3. Prüfe Database-Performance (langsame Queries)

**Stripe Webhooks prüfen:**
1. Gehe zu Stripe Dashboard → Developers → Webhooks
2. Prüfe Delivery-Rate (sollte >99% sein)
3. Bei Fehlern: Webhook Secret neu generieren

---

### 5. Database-Backups verifizieren

**Häufigkeit:** Wöchentlich

**Was du tun musst:**
1. Gehe zu Supabase Dashboard → Database → Backups
2. Überprüfe, dass automatische Backups laufen
3. Teste Restore-Prozess (1x pro Monat)
4. Bei Problemen: Supabase Support kontaktieren

**Backup-Strategie:**
- Supabase: Automatische Daily Backups (7 Tage Retention)
- Empfohlen: Zusätzliche wöchentliche Exports via `pg_dump`

---

### 6. Marketing & Sales

**Häufigkeit:** Kontinuierlich

**Was du tun musst:**

**Paid Ads schalten:**
- Google Ads: Ziel auf `/pricing` oder `/` mit UTM-Parametern
- Facebook/Instagram Ads: Ziel auf `/features` oder `/contact`
- LinkedIn Ads: Ziel auf `/about` oder `/contact`

**Sales Calls führen:**
- Contact-Anfragen aus `/contact` bearbeiten
- Demo-Calls buchen (Calendly oder manuell)
- Follow-ups nach Demo

**Affiliate-Partner akquirieren:**
- Outreach an Fitness-Influencer, Coaches, Berater
- Link zu `/affiliate` teilen
- Partner-Onboarding ist vollautomatisch (Self-Service)

**Content Marketing:**
- Blog-Posts schreiben (optional, `/blog` ist vorbereitet)
- Social Media Posts (LinkedIn, Instagram)
- Case Studies von erfolgreichen Studios

---

### 7. Affiliate-Programm verwalten

**Häufigkeit:** Monatlich

**Was du tun musst:**

**Auto-Approval aktiviert?**
- Wenn `AFFILIATE_AUTO_APPROVE=true`: Partner werden sofort freigeschaltet
- Wenn `AFFILIATE_AUTO_APPROVE=false`: Du musst Partner manuell freischalten

**Manuelle Freischaltung (falls Auto-Approval=false):**
1. Gehe zu `/dashboard/admin/affiliates`
2. Prüfe neue Anfragen (Status: "pending")
3. Entscheide: Approve oder Reject
4. Bei Approve: Status auf "active" setzen

**Provisionen auszahlen:**
1. Gehe zu `/dashboard/admin/affiliates`
2. Prüfe fällige Provisionen (ab 50€ Mindestauszahlung)
3. Überweise manuell via SEPA/PayPal
4. Markiere als "ausgezahlt" im System

**Partner-Support:**
- Fragen zu Tracking: Prüfe `/dashboard/affiliate` (Partner-Sicht)
- Fragen zu Provisionen: Prüfe Stripe Conversions
- Technische Probleme: Prüfe Cookie-Tracking (`/r/[code]` Route)

---

### 8. Feature-Requests & Bug-Reports priorisieren

**Häufigkeit:** Wöchentlich

**Was du tun musst:**
1. Sammle Feedback von Studios (Support-Mails, Calls)
2. Priorisiere nach Impact & Effort
3. Erstelle GitHub Issues oder Notion-Board
4. Plane nächste Iteration mit Entwickler/Devin

**Typische Feature-Requests:**
- Mehr Integrationen (Zapier, Make.com, etc.)
- Mobile Apps (iOS, Android)
- Erweiterte Analytics
- Multi-Language Support (EN, ES, FR)
- Custom Branding für Studios

---

## 🚨 Notfall-Szenarien

### Szenario 1: Website ist down

**Symptome:** 500 Error, Vercel zeigt "Deployment Failed"

**Sofort-Maßnahmen:**
1. Gehe zu Vercel Dashboard → Deployments
2. Prüfe letztes Deployment (rot = failed)
3. Klicke auf "Redeploy" vom letzten erfolgreichen Deployment
4. Wenn das nicht hilft: Rollback zu vorherigem Commit

**Langfristig:**
- Prüfe Vercel Logs für Root Cause
- Fixe Bug im Code
- Deploye neues Release

---

### Szenario 2: Stripe Webhooks funktionieren nicht

**Symptome:** Kunden bezahlen, aber Onboarding startet nicht

**Sofort-Maßnahmen:**
1. Gehe zu Stripe Dashboard → Developers → Webhooks
2. Prüfe Delivery-Rate (sollte >99% sein)
3. Prüfe Webhook Secret in Vercel ENV
4. Teste Webhook manuell: Stripe CLI `stripe trigger checkout.session.completed`

**Langfristig:**
- Webhook Secret neu generieren
- Vercel ENV aktualisieren
- Webhook-Queue prüfen (Upstash Redis)

---

### Szenario 3: Twilio-Guthaben aufgebraucht

**Symptome:** Phone-AI funktioniert nicht mehr, Fehler in Logs

**Sofort-Maßnahmen:**
1. Gehe zu Twilio Console → Billing
2. Lade Guthaben auf (Auto-Recharge empfohlen)
3. Prüfe, ob Nummern noch aktiv sind

**Langfristig:**
- Auto-Recharge aktivieren (ab $100)
- Alerts einrichten (bei <$50 Guthaben)

---

### Szenario 4: Database ist voll

**Symptome:** Langsame Queries, Fehler "disk full"

**Sofort-Maßnahmen:**
1. Gehe zu Supabase Dashboard → Database → Usage
2. Prüfe Speicherverbrauch
3. Upgrade Plan (wenn nötig)
4. Alte Daten archivieren (z.B. CallLogs >90 Tage)

**Langfristig:**
- Automatische Archivierung einrichten
- Monitoring für DB-Größe

---

## 📊 KPIs & Monitoring

### Täglich prüfen:
- [ ] Neue Signups (Supabase Auth Dashboard)
- [ ] Neue Subscriptions (Stripe Dashboard)
- [ ] Error-Rate (Vercel Logs)
- [ ] Support-Mails (support@pilarsystems.com)

### Wöchentlich prüfen:
- [ ] MRR (Monthly Recurring Revenue) in Stripe
- [ ] Churn-Rate (gekündigte Subscriptions)
- [ ] Affiliate-Conversions
- [ ] Database-Backups
- [ ] Feature-Requests priorisieren

### Monatlich prüfen:
- [ ] Affiliate-Provisionen auszahlen
- [ ] Stripe Payouts verifizieren
- [ ] API Keys rotieren (alle 90 Tage)
- [ ] Performance-Optimierung (Lighthouse Score)
- [ ] Security-Audit (Dependencies updaten)

---

## 🎓 Weiterführende Ressourcen

**Dokumentation:**
- [SETUP_PILAR_SYSTEMS_FINAL.md](./SETUP_PILAR_SYSTEMS_FINAL.md) - Komplette Setup-Anleitung
- [PRODUCTION_AUDIT_REPORT_FINAL.md](./PRODUCTION_AUDIT_REPORT_FINAL.md) - Production Audit

**Provider-Dashboards:**
- Vercel: https://vercel.com/pilars-projects-e4c42fac/pilarsystems
- Supabase: https://supabase.com/dashboard
- Stripe: https://dashboard.stripe.com
- Twilio: https://console.twilio.com
- OpenAI: https://platform.openai.com

**Support-Kanäle:**
- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support
- Stripe Support: https://support.stripe.com
- Twilio Support: https://support.twilio.com

---

## ✅ Launch-Checklist (Vor Go-Live)

- [ ] Alle ENV-Variablen in Vercel gesetzt
- [ ] Stripe Produkte erstellt (`npx ts-node scripts/create-stripe-products.ts`)
- [ ] Stripe Webhooks konfiguriert (Production URL)
- [ ] Domain konfiguriert (DNS, SSL)
- [ ] Legal Pages aktualisiert (Impressum, Datenschutz, AGB)
- [ ] Contact Email getestet (support@pilarsystems.com)
- [ ] Admin Emails gesetzt (`ADMIN_EMAILS`)
- [ ] Rate Limiting aktiviert (Upstash Redis empfohlen)
- [ ] Test-Signup durchgeführt (kompletter Flow)
- [ ] Test-Checkout durchgeführt (Stripe Test Mode)
- [ ] Affiliate-Flow getestet (/r/CODE → Signup → Conversion)
- [ ] Mobile Experience getestet (360px Breakpoint)
- [ ] Browser Console clean (keine Errors)

---

## 🎉 Nach dem Launch

**Erste 24 Stunden:**
- Logs intensiv monitoren (Vercel + Supabase)
- Support-Mails sofort beantworten
- Erste Signups persönlich betreuen
- Feedback sammeln

**Erste Woche:**
- Täglich Logs prüfen
- Performance optimieren (langsame Queries)
- Kleine Bugs fixen
- Marketing intensivieren

**Erste Monat:**
- Wöchentlich KPIs reviewen
- Feature-Requests priorisieren
- Affiliate-Partner akquirieren
- Case Studies erstellen

---

**Viel Erfolg beim Launch! 🚀**

Bei Fragen oder Problemen: Prüfe zuerst die Logs, dann die Dokumentation, dann Support kontaktieren.
