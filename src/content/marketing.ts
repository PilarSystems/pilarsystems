/**
 * Centralized marketing content for PILAR SYSTEMS
 * Edit this file to update copy across all marketing pages
 */

export const testimonials = [
  {
    id: 1,
    name: 'Michael Schmidt',
    role: 'Inhaber',
    studio: 'FitMax Berlin',
    image: '/marketing/testimonials/michael.jpg', // TODO: Add real image
    rating: 5,
    quote: 'Seit wir PILAR nutzen, verpassen wir keinen einzigen Anruf mehr. Die KI-Rezeption arbeitet 24/7 und unsere Conversion-Rate ist um 40% gestiegen.',
  },
  {
    id: 2,
    name: 'Sarah Weber',
    role: 'Geschäftsführerin',
    studio: 'PowerGym München',
    image: '/marketing/testimonials/sarah.jpg', // TODO: Add real image
    rating: 5,
    quote: 'Die WhatsApp-Automation spart uns täglich mehrere Stunden. Leads werden automatisch qualifiziert und Follow-ups laufen komplett automatisch.',
  },
  {
    id: 3,
    name: 'Thomas Müller',
    role: 'Studio-Leiter',
    studio: 'Athletic Club Hamburg',
    image: '/marketing/testimonials/thomas.jpg', // TODO: Add real image
    rating: 5,
    quote: 'Endlich haben wir alle Kanäle in einem System. Telefon, WhatsApp, E-Mail – alles zentral. Das spart enorm Zeit und wir verlieren keine Leads mehr.',
  },
  {
    id: 4,
    name: 'Julia Hoffmann',
    role: 'Inhaberin',
    studio: 'FitZone Köln',
    image: '/marketing/testimonials/julia.jpg', // TODO: Add real image
    rating: 5,
    quote: 'Das Setup war super einfach und nach 2 Tagen lief alles. Der Support ist top und die Automatisierung funktioniert einwandfrei.',
  },
]

export const chatExamples = {
  whatsapp: [
    {
      id: 1,
      direction: 'inbound' as const,
      sender: 'Lead',
      message: 'Hallo, ich interessiere mich für ein Probetraining. Wann habt ihr Zeit?',
      timestamp: '14:23',
    },
    {
      id: 2,
      direction: 'outbound' as const,
      sender: 'PILAR AI',
      message: 'Hallo! 👋 Schön, dass du dich für uns interessierst. Ich bin die KI-Assistentin von FitMax. Wir haben morgen um 10:00, 14:00 und 18:00 Uhr freie Slots. Was passt dir am besten?',
      timestamp: '14:23',
    },
    {
      id: 3,
      direction: 'inbound' as const,
      sender: 'Lead',
      message: '18:00 Uhr wäre perfekt!',
      timestamp: '14:25',
    },
    {
      id: 4,
      direction: 'outbound' as const,
      sender: 'PILAR AI',
      message: 'Super! ✅ Ich habe dich für morgen um 18:00 Uhr eingetragen. Bitte bring bequeme Sportkleidung mit. Ich schicke dir gleich eine Bestätigung per E-Mail. Bis morgen!',
      timestamp: '14:25',
    },
  ],
  phone: [
    {
      id: 1,
      speaker: 'AI',
      text: 'Guten Tag, hier ist die KI-Rezeption von FitMax. Wie kann ich Ihnen helfen?',
    },
    {
      id: 2,
      speaker: 'Kunde',
      text: 'Ich würde gerne ein Probetraining buchen.',
    },
    {
      id: 3,
      speaker: 'AI',
      text: 'Sehr gerne! Ich schaue gleich nach freien Terminen. Wann hätten Sie denn Zeit? Vormittags, nachmittags oder abends?',
    },
    {
      id: 4,
      speaker: 'Kunde',
      text: 'Am liebsten abends nach der Arbeit.',
    },
    {
      id: 5,
      speaker: 'AI',
      text: 'Perfekt. Ich habe morgen um 18:00 Uhr und übermorgen um 19:00 Uhr freie Slots. Was passt Ihnen besser?',
    },
  ],
}

export const kpis = [
  {
    id: 1,
    label: 'Mehr Probetrainings',
    value: '+40%',
    description: 'Durch 24/7 Erreichbarkeit',
    icon: 'TrendingUp',
  },
  {
    id: 2,
    label: 'Höhere Conversion',
    value: '+25%',
    description: 'Dank automatischer Follow-ups',
    icon: 'Target',
  },
  {
    id: 3,
    label: 'Weniger verpasste Anrufe',
    value: '-60%',
    description: 'KI nimmt jeden Anruf entgegen',
    icon: 'Phone',
  },
  {
    id: 4,
    label: 'Zeitersparnis',
    value: '15h/Woche',
    description: 'Durch Automatisierung',
    icon: 'Clock',
  },
]

export const trustBadges = [
  {
    id: 1,
    title: 'DSGVO-konform',
    description: 'Hosting in Deutschland, volle Datenkontrolle',
    icon: 'Shield',
  },
  {
    id: 2,
    title: 'Stripe Payment',
    description: 'Sichere Zahlungen über Stripe',
    icon: 'CreditCard',
  },
  {
    id: 3,
    title: 'Made in Germany',
    description: 'Entwickelt und gehostet in Deutschland',
    icon: 'MapPin',
  },
  {
    id: 4,
    title: '24/7 Support',
    description: 'Deutscher Support bei Fragen',
    icon: 'Headphones',
  },
]

export const features = {
  phone: {
    title: 'AI Phone Rezeption',
    description: 'Deine KI-Rezeption nimmt jeden Anruf entgegen – 24/7, auch nachts und am Wochenende.',
    benefits: [
      'Natürliche Gespräche mit ElevenLabs Voice AI',
      'Automatische Terminbuchung im Kalender',
      'Lead-Qualifizierung während des Gesprächs',
      'Transkripte und Zusammenfassungen aller Anrufe',
      'Automatische Follow-ups nach dem Gespräch',
    ],
  },
  whatsapp: {
    title: 'WhatsApp AI Automation',
    description: 'Automatische Antworten auf WhatsApp-Nachrichten – schnell, persönlich und rund um die Uhr.',
    benefits: [
      'Sofortige Antworten auf Anfragen',
      'Automatische Terminvorschläge',
      'Follow-up-Sequenzen für Leads',
      'Integration mit deinem CRM',
      'Personalisierte Nachrichten basierend auf Lead-Daten',
    ],
  },
  email: {
    title: 'Email AI Automation',
    description: 'Automatische E-Mail-Antworten und Follow-ups – nie wieder eine Anfrage verpassen.',
    benefits: [
      'Automatische Antworten auf Standardanfragen',
      'Follow-up-Sequenzen für neue Leads',
      'Personalisierte E-Mails basierend auf Lead-Status',
      'Integration mit deinem E-Mail-Postfach',
      'Automatische Lead-Klassifizierung',
    ],
  },
  leads: {
    title: 'Lead Engine & CRM',
    description: 'Alle Leads zentral verwalten, automatisch qualifizieren und priorisieren.',
    benefits: [
      'Automatische Lead-Klassifizierung (A/B/C)',
      'Zentrale Übersicht aller Kontakte',
      'Automatische Priorisierung nach Conversion-Wahrscheinlichkeit',
      'Vollständige Kommunikationshistorie',
      'Aufgaben und Erinnerungen für dein Team',
    ],
  },
  calendar: {
    title: 'Kalender & Booking',
    description: 'Automatische Terminbuchung über alle Kanäle – Probetrainings, PT-Sessions, Vertragsge spräche.',
    benefits: [
      'Google Calendar Integration',
      'Automatische Terminvorschläge',
      'Erinnerungen per WhatsApp und E-Mail',
      'Konflikt-Vermeidung durch Echtzeit-Sync',
      'Automatische No-Show-Erkennung',
    ],
  },
  analytics: {
    title: 'Analytics & KPIs',
    description: 'Alle wichtigen Kennzahlen auf einen Blick – Leads, Conversions, Umsatz.',
    benefits: [
      'Echtzeit-Dashboard mit allen KPIs',
      'Lead-Funnel-Analyse',
      'Conversion-Tracking über alle Kanäle',
      'Umsatz-Prognosen',
      'Export für Buchhaltung und Controlling',
    ],
  },
}

export const pricing = {
  basic: {
    name: 'Basic',
    price: 100,
    setupFee: 500,
    currency: 'EUR',
    interval: 'Monat',
    description: 'Perfekt für kleine Studios mit bis zu 200 Mitgliedern',
    features: [
      'AI Phone Rezeption (bis 100 Anrufe/Monat)',
      'WhatsApp AI (bis 500 Nachrichten/Monat)',
      'Email AI (bis 200 E-Mails/Monat)',
      'Lead Engine & CRM',
      'Kalender Integration',
      'Analytics Dashboard',
      'Deutscher Support',
    ],
    cta: 'Jetzt starten',
    popular: false,
  },
  pro: {
    name: 'Pro',
    price: 149,
    setupFee: 1000,
    currency: 'EUR',
    interval: 'Monat',
    description: 'Für wachsende Studios und Gym-Ketten',
    features: [
      'AI Phone Rezeption (unbegrenzt)',
      'WhatsApp AI (unbegrenzt)',
      'Email AI (unbegrenzt)',
      'Lead Engine & CRM',
      'Kalender Integration',
      'Analytics Dashboard',
      'Prioritäts-Support',
      'Custom AI-Regeln',
      'Multi-Standort Support',
      'API-Zugang',
    ],
    cta: 'Jetzt starten',
    popular: true,
  },
  whatsappAddon: {
    name: 'WhatsApp Add-on',
    price: 20,
    currency: 'EUR',
    interval: 'Monat',
    description: 'Zusätzliche WhatsApp-Kapazität',
    features: [
      '+1000 WhatsApp-Nachrichten/Monat',
      'Für Basic und Pro buchbar',
    ],
  },
}

export const faq = [
  {
    id: 1,
    question: 'Wie lange dauert das Setup?',
    answer: 'Das initiale Setup dauert ca. 1-2 Stunden. Du durchläufst einen geführten Onboarding-Wizard, der dich durch alle Schritte führt. Nach dem Setup ist das System sofort einsatzbereit.',
  },
  {
    id: 2,
    question: 'Kann ich jederzeit kündigen?',
    answer: 'Ja, du kannst monatlich kündigen. Es gibt keine Mindestvertragslaufzeit. Die Setup-Gebühr wird bei Kündigung nicht erstattet.',
  },
  {
    id: 3,
    question: 'Ist PILAR DSGVO-konform?',
    answer: 'Ja, PILAR ist vollständig DSGVO-konform. Alle Daten werden in Deutschland gehostet und du behältst die volle Kontrolle über deine Daten. Wir haben einen Auftragsverarbeitungsvertrag (AVV) vorbereitet.',
  },
  {
    id: 4,
    question: 'Welche Integrationen werden unterstützt?',
    answer: 'PILAR integriert sich mit Google Calendar, Twilio (Telefon), WhatsApp Business API, IMAP/SMTP (E-Mail) und n8n (Workflows). Weitere Integrationen sind in Planung.',
  },
  {
    id: 5,
    question: 'Kann ich die KI-Antworten anpassen?',
    answer: 'Ja, im Pro-Plan kannst du eigene AI-Regeln definieren und die Antworten der KI an deine Studio-Philosophie anpassen. Im Basic-Plan nutzt du unsere Standard-Templates.',
  },
  {
    id: 6,
    question: 'Was passiert, wenn ich mehr Anrufe/Nachrichten habe als im Plan enthalten?',
    answer: 'Im Basic-Plan werden zusätzliche Anrufe/Nachrichten mit 0,50€ pro Einheit abgerechnet. Im Pro-Plan sind alle Kanäle unbegrenzt.',
  },
  {
    id: 7,
    question: 'Gibt es einen Testzeitraum?',
    answer: 'Wir bieten aktuell keinen kostenlosen Testzeitraum an, aber du kannst jederzeit eine Demo buchen, um das System live zu sehen. Die Setup-Gebühr deckt das initiale Onboarding ab.',
  },
  {
    id: 8,
    question: 'Wie funktioniert der Support?',
    answer: 'Wir bieten deutschen E-Mail-Support (Antwort innerhalb von 24h) und eine umfangreiche Wissensdatenbank. Pro-Kunden erhalten Prioritäts-Support mit schnelleren Antwortzeiten.',
  },
]

export const socialProof = {
  studiosCount: '50+',
  leadsProcessed: '10.000+',
  callsHandled: '5.000+',
  satisfactionRate: '98%',
}
