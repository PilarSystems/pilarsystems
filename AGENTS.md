# AGENTS.md – Pilar Systems

## Projektüberblick

Du arbeitest in einem bestehenden Next.js 14 + TypeScript + Tailwind Projekt namens **Pilar Systems**.

- Zielgruppe: Fitnessstudios / Gyms + später Endkunden (Gym Buddy).
- Frontend: ist bereits weitgehend vorhanden (Marketing-Seiten, Auth, Dashboard). 
- Hauptfokus für dich: **Backend, KI-Infrastruktur, Integrationen und Automatisierung**.

## Produkt-Vision (wichtig)

Wir bauen kein kleines MVP, sondern von Anfang an eine **Enterprise-fähige KI-Plattform**, die:

1. **Für Fitnessstudios (B2B)**:
   - Eigenen KI-Assistenten pro Studio bereitstellt (Telefon, WhatsApp, E-Mail).
   - Sich an bestehende Tools des Studios andockt (Magicline, Fitogram, Google Calendar etc.).
   - Vollautomatisch Leads qualifiziert, Termine legt, Mitglieder betreut.
   - Multi-Tenant ist: jedes Studio ist ein eigener Mandant.

2. **Für Endkunden (B2C, Gym Buddy)**:
   - Ein persönlicher KI-Coach auf WhatsApp / später App:
     - tägliche Nachrichten,
     - Trainingspläne,
     - Ernährung,
     - Motivation,
     - Protokolle & Tracking.
   - Abrechnung im Abo-Modell (z. B. 9,99–29,99 €/Monat).

Founder (Frederik) will nach Launch nur noch:
- Marketing,
- Sales,
- Minimal-Support.

**Keine manuelle technische Arbeit mehr**: Onboarding, Nummern, Integrationen etc. laufen vollautomatisch.

## Tech-Stack Vorgaben

- Backend: **Node.js + TypeScript**.
- HTTP Framework: **Fastify** (oder vergleichbares leichtes Framework, aber bevorzuge Fastify).
- Datenbank-Layer: Prisma + Postgres (oder kompatibel).
- Realtime Voice: **OpenAI Realtime API** als KI-Sprach-Engine.
- Telefonie: Eigener SIP/VoIP-Layer (keine Abhängigkeit von Twilio/Fonia).
- Messaging: Eigener WhatsApp-Layer über WhatsApp Cloud API.
- Frontend bleibt Next.js 14 (App Router), du passt es nur an, wenn nötig (z. B. neue API-Endpoints oder Settings-Oberflächen).

## Architektur – Grobe Module

1. **/server/core**
   - `voiceEngine` (OpenAI Realtime + SIP-Brücke).
   - `whatsappEngine`.
   - `emailEngine`.
   - `trainingPlanEngine`.
   - `bookingEngine`.
   - `growthEngine` (Auswertungen / Empfehlungen).

2. **/server/connectors**
   - `googleCalendarConnector`.
   - `magiclineConnector`.
   - `fitogramConnector`.
   - `csvConnector`.
   - Gemeinsames Normalisierungsmodell (z. B. `UnifiedSchedule`, `UnifiedMember`).

3. **/server/tenants**
   - Multi-Tenant-Struktur:
     - `Tenant` (Studio),
     - `User` (Studio-Admin),
     - `Integration`,
     - `PhoneNumber`,
     - `WhatsAppChannel`,
     - `Conversation`,
     - `WorkoutPlan`,
     - etc.

4. **/server/orchestrator**
   - Central Brain:
     - Routing zwischen Voice / WhatsApp / Mail.
     - Welche KI-Engine wann?
     - Welche Connectoren? (z. B. Termine).
     - Welche Studio-Regeln (Branding, Sprache, Preise etc.).

5. **/server/webhooks**
   - Endpoints für:
     - eingehende Anrufe (SIP-Signalisierung → Realtime).
     - WhatsApp-Nachrichten (Cloud API).
     - ggf. Integrationen (z. B. Magicline Webhooks).

6. **/server/db**
   - Prisma-Schema, DB-Zugriff, Migrations.

7. **/app/api/** (Next.js)
   - API-Routen als HTTP-Fassade fürs Frontend:
     - z. B. `/api/tenant/setup`, `/api/agent/config`, `/api/metrics`.

## Arbeitsstil, den du einhalten sollst

- Arbeite **inkrementell und modular**.
- Mach **nie** „alles auf einmal“.  
  Stattdessen:
  - Pro Task: 1 klar umrissener Teil (z. B. „Multi-Tenant DB + Prisma Setup“).
  - Erstelle einen Plan, dann implementiere Schritt für Schritt.
  - Stelle sicher, dass `npm run lint` und `npm run build` durchlaufen.
- Dokumentiere neue Module kurz in README- oder docs-Dateien.
- Schreibe sinnvolle Logs, aber kein Logging-Spam.

## Was du NICHT tun sollst

- Kein komplettes Re-Design des Frontends.
- Kein unnötiger Tech-Wechsel.
- Kein riesiger Rewrite, wenn nicht nötig.
- Keine Single-Task-Magie wie „bau die komplette KI-Plattform in einem Rutsch“.

Stattdessen:
- Für jede größere Aufgabe: Plan → implementieren → testen → Ergebnis dokumentieren.

