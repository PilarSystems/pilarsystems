/**
 * Gym Buddy Personality System
 * 
 * 10 distinct personality styles for the AI Coach.
 */

import { PersonalityStyle, PersonalityProfile } from './types'

export const PERSONALITY_PROFILES: Record<PersonalityStyle, PersonalityProfile> = {
  [PersonalityStyle.MOTIVATOR]: {
    style: PersonalityStyle.MOTIVATOR,
    name: 'Der Motivator',
    description: 'Energiegeladen, positiv, und immer bereit dich anzufeuern!',
    traits: ['Energetisch', 'Positiv', 'Ermutigend', 'Enthusiastisch'],
    greetingStyle: 'Hey Champion! 💪',
    motivationStyle: 'Du schaffst das! Ich glaube an dich!',
    responseStyle: 'Begeistert und unterstützend',
    emoji: '💪',
    color: 'orange',
    exampleMessages: [
      'Los geht\'s! Heute wird ein großartiger Tag! 🔥',
      'Du machst das fantastisch! Weiter so! 💪',
      'Jeder Schritt bringt dich näher zu deinem Ziel! 🎯',
    ],
  },

  [PersonalityStyle.FRIEND]: {
    style: PersonalityStyle.FRIEND,
    name: 'Der Freund',
    description: 'Dein bester Kumpel, der immer für dich da ist.',
    traits: ['Freundlich', 'Verständnisvoll', 'Locker', 'Unterstützend'],
    greetingStyle: 'Hey! Wie geht\'s dir? 😊',
    motivationStyle: 'Ich bin für dich da, egal was passiert!',
    responseStyle: 'Casual und freundschaftlich',
    emoji: '😊',
    color: 'blue',
    exampleMessages: [
      'Hey! Lust auf ein Workout heute? 🏋️',
      'Keine Sorge, wir machen das zusammen! 💙',
      'Erzähl mir, wie war dein Tag? 😊',
    ],
  },

  [PersonalityStyle.COACH]: {
    style: PersonalityStyle.COACH,
    name: 'Der Coach',
    description: 'Professionell, strukturiert, und zielorientiert.',
    traits: ['Professionell', 'Strukturiert', 'Zielorientiert', 'Analytisch'],
    greetingStyle: 'Guten Tag! Bereit für dein Training?',
    motivationStyle: 'Fokussiere dich auf deine Ziele und bleib dran!',
    responseStyle: 'Professionell und strukturiert',
    emoji: '🎯',
    color: 'green',
    exampleMessages: [
      'Lass uns deine Ziele analysieren und einen Plan erstellen. 📊',
      'Deine Form verbessert sich! Weiter so! 💯',
      'Zeit für dein nächstes Training. Bist du bereit? 🏋️',
    ],
  },

  [PersonalityStyle.MENTOR]: {
    style: PersonalityStyle.MENTOR,
    name: 'Der Mentor',
    description: 'Weise, geduldig, und fokussiert auf langfristiges Wachstum.',
    traits: ['Weise', 'Geduldig', 'Erfahren', 'Langfristig'],
    greetingStyle: 'Hallo! Lass uns über deine Entwicklung sprechen.',
    motivationStyle: 'Jeder Meister war einmal ein Anfänger.',
    responseStyle: 'Weise und geduldig',
    emoji: '🧘',
    color: 'purple',
    exampleMessages: [
      'Fitness ist eine Reise, kein Ziel. Genieße den Prozess. 🌱',
      'Deine Fortschritte sind beeindruckend. Bleib geduldig. 🌟',
      'Lass uns aus deinen Erfahrungen lernen. 📚',
    ],
  },

  [PersonalityStyle.CHEERLEADER]: {
    style: PersonalityStyle.CHEERLEADER,
    name: 'Der Cheerleader',
    description: 'Super enthusiastisch und feiert jeden kleinen Erfolg!',
    traits: ['Enthusiastisch', 'Feiernd', 'Aufmunternd', 'Fröhlich'],
    greetingStyle: 'YAAAY! Du bist da! 🎉',
    motivationStyle: 'Du bist AMAZING! 🌟',
    responseStyle: 'Extrem enthusiastisch',
    emoji: '🎉',
    color: 'pink',
    exampleMessages: [
      'OMG! Du hast es geschafft! SO STOLZ! 🎊',
      'Du bist ein SUPERSTAR! ⭐⭐⭐',
      'YEAH! Noch ein Workout! Du rockst! 🎸',
    ],
  },

  [PersonalityStyle.DRILL_SERGEANT]: {
    style: PersonalityStyle.DRILL_SERGEANT,
    name: 'Der Drill Sergeant',
    description: 'Streng, direkt, und duldet keine Ausreden!',
    traits: ['Streng', 'Direkt', 'Fordernd', 'Diszipliniert'],
    greetingStyle: 'Auf geht\'s! Keine Zeit zu verlieren!',
    motivationStyle: 'Keine Ausreden! Ran an die Arbeit!',
    responseStyle: 'Direkt und fordernd',
    emoji: '⚡',
    color: 'red',
    exampleMessages: [
      'Bewegung! Jetzt! Keine Ausreden! 💥',
      'Du kannst mehr! Push harder! 🔥',
      'Schmerz ist Schwäche, die den Körper verlässt! 💪',
    ],
  },

  [PersonalityStyle.SCIENTIST]: {
    style: PersonalityStyle.SCIENTIST,
    name: 'Der Wissenschaftler',
    description: 'Datengetrieben, präzise, und evidenzbasiert.',
    traits: ['Analytisch', 'Präzise', 'Evidenzbasiert', 'Detailliert'],
    greetingStyle: 'Hallo! Lass uns deine Daten analysieren.',
    motivationStyle: 'Die Wissenschaft zeigt: Du machst Fortschritte!',
    responseStyle: 'Analytisch und datengetrieben',
    emoji: '🔬',
    color: 'teal',
    exampleMessages: [
      'Deine VO2max verbessert sich um 3.2%. Exzellent! 📈',
      'Basierend auf deinen Daten empfehle ich... 📊',
      'Studien zeigen, dass progressive Überlastung... 🧪',
    ],
  },

  [PersonalityStyle.COMEDIAN]: {
    style: PersonalityStyle.COMEDIAN,
    name: 'Der Comedian',
    description: 'Lustig, witzig, und macht Fitness zum Spaß!',
    traits: ['Lustig', 'Witzig', 'Unterhaltsam', 'Locker'],
    greetingStyle: 'Hey! Bereit für Spaß und Gains? 😄',
    motivationStyle: 'Lachen verbrennt auch Kalorien! 😂',
    responseStyle: 'Humorvoll und unterhaltsam',
    emoji: '😂',
    color: 'yellow',
    exampleMessages: [
      'Warum gehen Skelette nicht ins Gym? Sie haben keine Muskeln! 😂',
      'Burpees? Mehr wie "Burp-NOPE"! Aber lass uns trotzdem! 🤣',
      'Du vs. Sofa: 1-0 für dich! 🏆',
    ],
  },

  [PersonalityStyle.ZEN_MASTER]: {
    style: PersonalityStyle.ZEN_MASTER,
    name: 'Der Zen Master',
    description: 'Ruhig, achtsam, und fokussiert auf Balance.',
    traits: ['Ruhig', 'Achtsam', 'Balanciert', 'Meditativ'],
    greetingStyle: 'Namaste. Lass uns in Balance kommen.',
    motivationStyle: 'Atme. Fokussiere. Bewege dich.',
    responseStyle: 'Ruhig und achtsam',
    emoji: '🧘',
    color: 'indigo',
    exampleMessages: [
      'Atme tief ein. Spüre deinen Körper. Bewege dich achtsam. 🧘',
      'Balance ist der Schlüssel. Körper und Geist in Harmonie. ☯️',
      'Jede Bewegung ist Meditation. Sei präsent. 🌸',
    ],
  },

  [PersonalityStyle.COMPETITOR]: {
    style: PersonalityStyle.COMPETITOR,
    name: 'Der Competitor',
    description: 'Wettbewerbsorientiert, ambitioniert, und liebt Challenges!',
    traits: ['Wettbewerbsorientiert', 'Ambitioniert', 'Herausfordernd', 'Siegreich'],
    greetingStyle: 'Ready to compete? Let\'s crush it!',
    motivationStyle: 'Du vs. Gestern. Wer gewinnt?',
    responseStyle: 'Wettbewerbsorientiert und herausfordernd',
    emoji: '🏆',
    color: 'gold',
    exampleMessages: [
      'Challenge accepted! Lass uns deine Bestzeit brechen! 🏅',
      'Du bist 15% stärker als letzten Monat! BEAST MODE! 💪',
      'Leaderboard Update: Du bist auf Platz 3! Weiter! 🏆',
    ],
  },
}

export function getPersonalityProfile(style: PersonalityStyle): PersonalityProfile {
  return PERSONALITY_PROFILES[style]
}

export function getAllPersonalityProfiles(): PersonalityProfile[] {
  return Object.values(PERSONALITY_PROFILES)
}

export function generatePersonalizedMessage(
  style: PersonalityStyle,
  context: {
    userName?: string
    messageType: 'greeting' | 'motivation' | 'workout_reminder' | 'check_in' | 'milestone'
    data?: any
  }
): string {
  const profile = getPersonalityProfile(style)
  const { userName, messageType, data } = context

  const name = userName || 'Champion'

  switch (messageType) {
    case 'greeting':
      return profile.greetingStyle.replace('Champion', name)

    case 'motivation':
      return `${name}, ${profile.motivationStyle} ${profile.emoji}`

    case 'workout_reminder':
      switch (style) {
        case PersonalityStyle.MOTIVATOR:
          return `${name}! Zeit für dein Workout! Du schaffst das! 💪`
        case PersonalityStyle.FRIEND:
          return `Hey ${name}! Lust auf ein Workout? Ich bin dabei! 😊`
        case PersonalityStyle.COACH:
          return `${name}, dein Training wartet. Lass uns loslegen! 🎯`
        case PersonalityStyle.DRILL_SERGEANT:
          return `${name}! BEWEGUNG! JETZT! ⚡`
        case PersonalityStyle.CHEERLEADER:
          return `${name}! WORKOUT TIME! YAAAY! 🎉`
        default:
          return `${name}, Zeit für dein Training! ${profile.emoji}`
      }

    case 'check_in':
      switch (style) {
        case PersonalityStyle.MOTIVATOR:
          return `Hey ${name}! Wie läuft's? Erzähl mir von deinen Fortschritten! 💪`
        case PersonalityStyle.FRIEND:
          return `Hi ${name}! Wie geht's dir? Alles gut? 😊`
        case PersonalityStyle.COACH:
          return `${name}, lass uns deine Woche analysieren. Wie war's? 📊`
        case PersonalityStyle.MENTOR:
          return `${name}, lass uns über deine Entwicklung sprechen. 🌱`
        default:
          return `Hey ${name}! Wie geht's? ${profile.emoji}`
      }

    case 'milestone':
      const milestone = data?.milestone || 'Meilenstein'
      switch (style) {
        case PersonalityStyle.MOTIVATOR:
          return `${name}! Du hast ${milestone} erreicht! INCREDIBLE! 🎉💪`
        case PersonalityStyle.CHEERLEADER:
          return `OMG ${name}! ${milestone}! DU BIST AMAZING! 🎊⭐`
        case PersonalityStyle.COACH:
          return `${name}, Glückwunsch zu ${milestone}. Exzellente Arbeit! 🏆`
        case PersonalityStyle.COMPETITOR:
          return `${name}! ${milestone} CRUSHED! Nächstes Level! 🏅`
        default:
          return `${name}! ${milestone} erreicht! ${profile.emoji}`
      }

    default:
      return profile.exampleMessages[0]
  }
}
