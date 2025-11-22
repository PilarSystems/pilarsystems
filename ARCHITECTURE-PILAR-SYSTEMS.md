# Pilar Systems – Backend & KI Architektur

## 1. Ziel

Ein vollautomatisiertes, Multi-Tenant KI-System für Fitnessstudios und Endkunden:

- **B2B:** KI-Assistent pro Studio (Telefon, WhatsApp, E-Mail, Termine, Lead-Quali).
- **B2C:** „Gym Buddy“ KI-Coach direkt für Endkunden.
- Founder soll nach Launch nur noch Marketing & Sales machen.

## 2. High-Level Komponenten

1. **Pilar Core Backend (Node.js + TS + Fastify)**
2. **Multi-Tenant DB (Postgres + Prisma)**
3. **Realtime Voice Layer (OpenAI Realtime API + SIP)**
4. **Messaging Layer (WhatsApp, E-Mail)**
5. **Connector Layer (Magicline, Fitogram, Google Calendar, CSV)**
6. **Orchestrator Layer (Routing, Business-Logik, KI-Kontext)**
7. **Owner Dashboard / Agent Baukasten (Frontend, bereits teilweise vorhanden)**
8. **Gym Buddy Engine (B2C, nutzt dieselben KI-Module)**

## 3. Ordnerstruktur (Ziel)

```txt
/src
  /app
    ... (Next.js Frontend)
    /api
      ... (HTTP API für Frontend, ruft server/* Services)
  /server
    /core
      voice/
      whatsapp/
      email/
      training/
      booking/
      growth/
    /connectors
      google-calendar/
      magicline/
      fitogram/
      csv/
      types.ts
    /orchestrator
      index.ts
      routingRules.ts
    /tenants
      models.ts
      service.ts
    /webhooks
      voiceWebhook.ts
      whatsappWebhook.ts
      integrationWebhooks.ts
    /db
      prisma/
        schema.prisma
      client.ts
