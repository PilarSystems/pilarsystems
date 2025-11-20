/**
 * German Marketing Copy
 * Centralized copy for PILAR SYSTEMS marketing pages
 * DACH-optimized, conversion-focused, uses "Du" form
 */

export const marketing = {
  brand: {
    name: 'PILAR SYSTEMS',
    tagline: 'Komplette KI-Infrastruktur für dein Fitnessstudio',
    description: 'Automatisiere dein Fitnessstudio mit AI. 24/7 Rezeption, Lead-Management, WhatsApp & Phone AI, Follow-Up Automation.',
  },

  cta: {
    primary: 'Jetzt starten',
    secondary: 'Mehr erfahren',
    demo: 'Demo buchen',
    signup: 'Kostenlos testen',
    contact: 'Kontakt aufnehmen',
    getStarted: 'Jetzt Zugang sichern',
    learnMore: 'Gesamte Automatisierung sehen',
    bookDemo: 'Persönliche Demo vereinbaren',
  },

  home: {
    hero: {
      title: 'Komplette KI-Infrastruktur für dein Fitnessstudio',
      subtitle: 'Automatisiere Lead-Management, Terminbuchung und Follow-Ups. 24/7 verfügbar. Keine manuellen Prozesse mehr.',
      stats: [
        { value: '500+', label: 'Studios vertrauen uns' },
        { value: '50k+', label: 'Leads pro Monat' },
        { value: '98%', label: 'Zufriedenheit' },
        { value: '24/7', label: 'Automatisierung' },
      ],
    },
    features: {
      title: 'Alles, was dein Studio braucht',
      subtitle: 'Eine Plattform. Alle Kanäle. Vollautomatisch.',
      items: [
        {
          title: 'KI-Rezeption (Telefon)',
          description: 'Nimmt Anrufe entgegen, beantwortet Fragen, bucht Termine – rund um die Uhr.',
        },
        {
          title: 'WhatsApp-KI',
          description: 'Automatische Nachrichtenverarbeitung, Lead-Qualifizierung und Follow-Ups.',
        },
        {
          title: 'WhatsApp-Gym-Buddy',
          description: 'Persönlicher Coach für deine Mitglieder – motiviert, plant, erinnert.',
        },
        {
          title: 'Studioanalyse',
          description: 'KI-gestützte Insights zu Leads, Conversions und Wachstumspotenzial.',
        },
        {
          title: 'Creative Planner',
          description: 'Content-Kalender mit KI-generierten Posts für Social Media.',
        },
        {
          title: 'Leads-Manager',
          description: 'Zentrale Übersicht aller Leads mit automatischer Priorisierung.',
        },
        {
          title: 'Wachstumsberatung',
          description: 'KI analysiert deine Daten und gibt konkrete Handlungsempfehlungen.',
        },
        {
          title: 'Kalender',
          description: 'Automatische Terminbuchung mit Google Calendar Synchronisation.',
        },
      ],
    },
    socialProof: {
      title: 'Vertraut von führenden Studios im DACH-Raum',
      testimonials: [
        {
          quote: 'Seit PILAR verpassen wir keinen Lead mehr. Die Automatisierung spart uns 20 Stunden pro Woche.',
          author: 'Michael Schmidt',
          role: 'Inhaber, FitZone München',
        },
        {
          quote: 'Die WhatsApp-KI ist genial. Unsere Mitglieder lieben den persönlichen Coach.',
          author: 'Sarah Weber',
          role: 'Geschäftsführerin, PowerGym Berlin',
        },
        {
          quote: 'ROI nach 2 Monaten. Die beste Investition für unser Studio.',
          author: 'Thomas Müller',
          role: 'Inhaber, StudioChain Österreich',
        },
      ],
    },
  },

  pricing: {
    hero: {
      title: 'Transparente Preise. Keine versteckten Kosten.',
      subtitle: 'Wähle den Plan, der zu deinem Studio passt. Jederzeit kündbar.',
    },
    billing: {
      monthly: 'Monatlich',
      yearly: 'Jährlich',
      save: '15% sparen',
    },
    plans: {
      basic: {
        name: 'Basic',
        price: '€100',
        setup: '€500 Setup-Gebühr',
        description: 'Perfekt für einzelne Studios',
        features: [
          'KI-Rezeption (Telefon)',
          'WhatsApp-KI',
          'E-Mail-Automatisierung',
          'Lead-Management',
          'Kalender-Integration',
          'Basis-Analytics',
          'E-Mail-Support',
        ],
      },
      pro: {
        name: 'Pro',
        price: '€149',
        setup: '€1.000 Setup-Gebühr',
        description: 'Für wachsende Studios & Ketten',
        recommended: true,
        features: [
          'Alles aus Basic',
          'WhatsApp-Gym-Buddy',
          'Creative Planner',
          'Wachstumsberatung',
          'Erweiterte Analytics',
          'Multi-Location Support',
          'Priority Support',
          'Persönlicher Onboarding-Call',
        ],
      },
    },
    addon: {
      title: 'WhatsApp-Gym-Buddy Add-on',
      price: '€20',
      description: 'Persönlicher KI-Coach für deine Mitglieder',
    },
    faq: {
      title: 'Häufige Fragen',
      items: [
        {
          question: 'Wie funktioniert die Setup-Gebühr?',
          answer: 'Die einmalige Setup-Gebühr deckt die komplette Einrichtung ab: Telefonnummer, WhatsApp-Integration, Kalender-Sync und Anpassung an deine Prozesse.',
        },
        {
          question: 'Kann ich jederzeit kündigen?',
          answer: 'Ja, du kannst monatlich kündigen. Keine Mindestlaufzeit, keine versteckten Kosten.',
        },
        {
          question: 'Welche Telefonnummer bekomme ich?',
          answer: 'Du kannst entweder eine neue deutsche Nummer von uns kaufen oder deine bestehende Nummer portieren.',
        },
        {
          question: 'Ist WhatsApp Business API enthalten?',
          answer: 'Ja, wir richten die WhatsApp Business API für dich ein. Du brauchst nur einen Facebook Business Manager Account.',
        },
        {
          question: 'Wie funktioniert die KI-Rezeption?',
          answer: 'Die KI nimmt Anrufe entgegen, versteht Anliegen, beantwortet Fragen und bucht Termine direkt in deinen Kalender.',
        },
        {
          question: 'Kann ich mehrere Standorte verwalten?',
          answer: 'Ja, mit dem Pro-Plan kannst du mehrere Standorte mit separaten Nummern und Kalendern verwalten.',
        },
        {
          question: 'Welche Sprachen unterstützt die KI?',
          answer: 'Aktuell Deutsch, Englisch und weitere Sprachen auf Anfrage.',
        },
        {
          question: 'Gibt es eine Geld-zurück-Garantie?',
          answer: 'Ja, 30 Tage Geld-zurück-Garantie ohne Wenn und Aber.',
        },
      ],
    },
  },

  features: {
    hero: {
      title: 'Alle Features im Detail',
      subtitle: 'Entdecke, wie PILAR dein Studio automatisiert',
    },
    deepDive: [
      {
        title: 'KI-Rezeption (Telefon)',
        description: 'Deine 24/7 Telefonzentrale',
        benefits: [
          'Nimmt alle Anrufe entgegen – auch außerhalb der Öffnungszeiten',
          'Versteht Anliegen und beantwortet häufige Fragen',
          'Bucht Probetrainings direkt in deinen Kalender',
          'Leitet komplexe Anfragen an dich weiter',
          'Reduziert verpasste Anrufe um 100%',
        ],
        useCases: [
          'Neukunden-Anfragen',
          'Terminbuchungen',
          'Öffnungszeiten & Preise',
          'Kursanmeldungen',
        ],
      },
      {
        title: 'WhatsApp-KI',
        description: 'Automatische Nachrichtenverarbeitung',
        benefits: [
          'Antwortet sofort auf WhatsApp-Nachrichten',
          'Qualifiziert Leads automatisch (A/B/C)',
          'Plant Follow-Ups basierend auf Lead-Status',
          'Sendet Erinnerungen vor Terminen',
          'Reduziert No-Shows um 40%',
        ],
        useCases: [
          'Lead-Qualifizierung',
          'Terminbestätigungen',
          'Follow-Up-Kampagnen',
          'Mitglieder-Support',
        ],
      },
      {
        title: 'WhatsApp-Gym-Buddy',
        description: 'Persönlicher KI-Coach für Mitglieder',
        benefits: [
          'Motiviert Mitglieder täglich',
          'Passt Trainingspläne an',
          'Erinnert an Workouts',
          'Beantwortet Fitness-Fragen',
          'Erhöht Retention um 25%',
        ],
        useCases: [
          'Trainingsplanung',
          'Ernährungstipps',
          'Motivations-Coaching',
          'Progress-Tracking',
        ],
      },
      {
        title: 'Lead-Management',
        description: 'Zentrale Übersicht aller Leads',
        benefits: [
          'Automatische Lead-Klassifizierung (A/B/C)',
          'Priorisierung nach Conversion-Wahrscheinlichkeit',
          'Aktivitäts-Timeline pro Lead',
          'One-Click Aktionen (Anrufen, WhatsApp, E-Mail)',
          'KI-Empfehlungen für nächste Schritte',
        ],
        useCases: [
          'Lead-Priorisierung',
          'Follow-Up-Management',
          'Conversion-Tracking',
          'Team-Koordination',
        ],
      },
      {
        title: 'Kalender & Terminbuchung',
        description: 'Automatische Terminverwaltung',
        benefits: [
          'Google Calendar Synchronisation',
          'Automatische Terminbuchung via Telefon & WhatsApp',
          'Erinnerungen vor Terminen',
          'No-Show-Reduktion durch KI-Follow-Ups',
          'Team-Kalender für mehrere Trainer',
        ],
        useCases: [
          'Probetrainings',
          'Personal Training',
          'Beratungsgespräche',
          'Kursbuchungen',
        ],
      },
      {
        title: 'Analytics & Wachstumsberatung',
        description: 'KI-gestützte Insights',
        benefits: [
          'Echtzeit-Dashboard mit KPIs',
          'Lead-Conversion-Analyse',
          'Channel-Performance (Telefon, WhatsApp, E-Mail)',
          'KI-Empfehlungen für Wachstum',
          'Automatische Reports',
        ],
        useCases: [
          'Performance-Tracking',
          'ROI-Analyse',
          'Kampagnen-Optimierung',
          'Strategische Planung',
        ],
      },
    ],
    integrations: {
      title: 'Integrationen',
      subtitle: 'PILAR verbindet sich mit deinen bestehenden Tools',
      items: [
        'Google Calendar',
        'WhatsApp Business API',
        'Twilio (Telefonie)',
        'OpenAI (KI-Engine)',
        'Stripe (Abrechnung)',
        'n8n (Workflows)',
      ],
    },
  },

  coach: {
    hero: {
      title: 'WhatsApp-Gym-Buddy',
      subtitle: 'Der persönliche KI-Coach für deine Mitglieder',
      description: 'Erhöhe Retention, motiviere Mitglieder und biete Premium-Service – vollautomatisch via WhatsApp.',
    },
    benefits: {
      title: 'Warum Gym-Buddy?',
      items: [
        {
          stat: '2B+',
          label: 'WhatsApp Nutzer weltweit',
        },
        {
          stat: '98%',
          label: 'Öffnungsrate',
        },
        {
          stat: '< 2 Min',
          label: 'Durchschnittliche Antwortzeit',
        },
      ],
    },
    useCases: {
      title: 'Was kann der Gym-Buddy?',
      items: [
        {
          title: 'Lead-Qualifizierung',
          description: 'Fragt nach Zielen, Erfahrung und Budget – klassifiziert Leads automatisch.',
        },
        {
          title: 'Terminbuchung',
          description: 'Bucht Probetrainings direkt in deinen Kalender – ohne dein Zutun.',
        },
        {
          title: 'FAQ-Beantwortung',
          description: 'Beantwortet häufige Fragen zu Preisen, Öffnungszeiten, Kursen.',
        },
        {
          title: 'Follow-Up-Automation',
          description: 'Sendet personalisierte Follow-Ups basierend auf Lead-Status.',
        },
        {
          title: 'Mitglieder-Support',
          description: 'Beantwortet Fragen von Mitgliedern – entlastet dein Team.',
        },
        {
          title: 'Event-Promotion',
          description: 'Informiert über neue Kurse, Events und Angebote.',
        },
      ],
    },
    howItWorks: {
      title: 'So funktioniert\'s',
      steps: [
        {
          title: 'WhatsApp verbinden',
          description: 'Wir richten die WhatsApp Business API für dich ein.',
        },
        {
          title: 'KI trainieren',
          description: 'Die KI lernt deine Studio-Infos, Preise und Prozesse.',
        },
        {
          title: 'Automatisch loslegen',
          description: 'Ab jetzt antwortet die KI auf alle WhatsApp-Nachrichten.',
        },
      ],
    },
    pricing: {
      title: 'Preise',
      description: 'WhatsApp-Gym-Buddy ist als Add-on für €20/Monat verfügbar.',
    },
  },

  solutions: {
    hero: {
      title: 'Lösungen für jedes Studio',
      subtitle: 'Egal ob Einzelstudio, Kette oder Personal Trainer – PILAR passt sich an.',
    },
    personas: [
      {
        title: 'Einzelnes Fitnessstudio',
        description: 'Perfekt für Studios mit 1-2 Standorten',
        challenges: [
          'Verpasste Anrufe außerhalb der Öffnungszeiten',
          'Zeitaufwand für Lead-Follow-Ups',
          'Hohe No-Show-Rate bei Probetrainings',
          'Manuelle Terminbuchung',
          'Fehlende Übersicht über Leads',
        ],
        solutions: [
          'KI-Rezeption nimmt alle Anrufe entgegen',
          'Automatische WhatsApp-Follow-Ups',
          'Erinnerungen vor Terminen',
          'Automatische Kalender-Buchung',
          'Zentrale Lead-Übersicht',
        ],
        results: [
          '+40% mehr gebuchte Probetrainings',
          '-60% verpasste Anrufe',
          '-40% No-Shows',
        ],
        plan: 'Basic',
      },
      {
        title: 'Studio-Ketten',
        description: 'Für Ketten mit 3+ Standorten',
        challenges: [
          'Inkonsistente Prozesse über Standorte',
          'Hoher Koordinationsaufwand',
          'Fehlende zentrale Übersicht',
          'Schwierige Skalierung',
          'Unterschiedliche Qualität im Kundenservice',
        ],
        solutions: [
          'Einheitliche Automatisierung für alle Standorte',
          'Zentrale Lead-Verwaltung',
          'Multi-Location Kalender',
          'Standort-übergreifende Analytics',
          'Konsistenter Service-Standard',
        ],
        results: [
          '+50% Effizienz durch Zentralisierung',
          '20h/Woche gespart pro Standort',
          '+30% Lead-Conversion',
        ],
        plan: 'Pro',
      },
      {
        title: 'Personal Trainer',
        description: 'Für selbstständige Trainer & Online-Coaches',
        challenges: [
          'Zeitaufwand für Kundenakquise',
          'Schwierige Terminkoordination',
          'Fehlende Automatisierung',
          'Begrenzte Skalierbarkeit',
          'Hoher Admin-Aufwand',
        ],
        solutions: [
          'Automatische Lead-Qualifizierung',
          'WhatsApp-Gym-Buddy für Kunden',
          'Automatische Terminbuchung',
          'Follow-Up-Automation',
          'Mehr Zeit für Training',
        ],
        results: [
          '+35% mehr Kunden',
          '15h/Woche gespart',
          '+45% Retention',
        ],
        plan: 'Basic',
      },
    ],
  },

  about: {
    hero: {
      title: 'Über PILAR SYSTEMS',
      subtitle: 'Wir bauen die Infrastruktur für vollautomatisierte Fitnessstudios im DACH-Raum.',
    },
    mission: {
      title: 'Unsere Mission',
      description: 'Wir glauben, dass Studiobetreiber ihre Zeit mit Training und Beratung verbringen sollten – nicht mit Admin-Arbeit. Deshalb bauen wir die beste KI-Infrastruktur für Fitnessstudios.',
    },
    vision: {
      title: 'Unsere Vision',
      description: 'Jedes Fitnessstudio im DACH-Raum soll Zugang zu Enterprise-Level Automatisierung haben – unabhängig von Größe oder Budget.',
    },
    values: [
      {
        title: 'Mission-Driven',
        description: 'Wir bauen für Studiobetreiber, nicht für Investoren.',
      },
      {
        title: 'DSGVO First',
        description: 'Datenschutz und Sicherheit haben oberste Priorität.',
      },
      {
        title: 'Customer Obsessed',
        description: 'Dein Erfolg ist unser Erfolg.',
      },
      {
        title: 'Innovation',
        description: 'Wir nutzen neueste KI-Technologie für maximalen Impact.',
      },
    ],
    timeline: [
      {
        year: '2023',
        title: 'Gründung',
        description: 'PILAR SYSTEMS wird gegründet mit der Vision, Fitnessstudios zu automatisieren.',
      },
      {
        year: '2024 Q1',
        title: 'Erste Studios',
        description: '10 Pilot-Studios testen die Plattform erfolgreich.',
      },
      {
        year: '2024 Q2',
        title: 'WhatsApp-Integration',
        description: 'WhatsApp Business API wird integriert.',
      },
      {
        year: '2024 Q3',
        title: '100+ Studios',
        description: 'Über 100 Studios nutzen PILAR aktiv.',
      },
      {
        year: '2024 Q4',
        title: 'Gym-Buddy Launch',
        description: 'WhatsApp-Gym-Buddy wird gelauncht.',
      },
      {
        year: '2025',
        title: 'DACH-Expansion',
        description: 'Expansion nach Österreich und Schweiz.',
      },
    ],
    team: [
      {
        role: 'Engineering',
        description: 'Erfahrene Engineers von führenden Tech-Unternehmen.',
      },
      {
        role: 'AI/ML',
        description: 'KI-Experten mit Fokus auf Conversational AI.',
      },
      {
        role: 'Fitness Industry',
        description: 'Ehemalige Studiobetreiber und Trainer.',
      },
      {
        role: 'Customer Success',
        description: 'Dediziertes Team für deinen Erfolg.',
      },
    ],
    whyChoose: [
      'DACH-Fokus: Optimiert für deutsche Studios',
      'DSGVO-konform: Alle Daten in Deutschland',
      'Schnelle Integration: Live in 48 Stunden',
      'Persönlicher Support: Deutschsprachiges Team',
      'Transparente Preise: Keine versteckten Kosten',
      'Bewährte Technologie: 500+ Studios vertrauen uns',
    ],
  },

  blog: {
    hero: {
      title: 'PILAR Blog',
      subtitle: 'Insights, Trends und Best Practices für Fitnessstudios',
    },
    categories: [
      'Alle',
      'Trends',
      'Marketing',
      'Tutorial',
      'Legal',
      'Business',
      'Case Study',
    ],
    newsletter: {
      title: 'Newsletter abonnieren',
      description: 'Erhalte monatlich Insights und Updates direkt in dein Postfach.',
      placeholder: 'deine@email.com',
      button: 'Abonnieren',
    },
  },

  footer: {
    tagline: 'Komplette KI-Infrastruktur für dein Fitnessstudio',
    company: 'Unternehmen',
    product: 'Produkt',
    legal: 'Rechtliches',
    social: 'Social Media',
    copyright: '© 2025 PILAR SYSTEMS. Alle Rechte vorbehalten.',
  },
}
