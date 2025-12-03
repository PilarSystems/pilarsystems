/**
 * Localization translations for Pilar Systems
 * Supports German (de) and English (en) for multilingual self-service
 */

export type Locale = 'de' | 'en';

export interface TranslationKeys {
  // Common
  common: {
    loading: string;
    save: string;
    cancel: string;
    back: string;
    continue: string;
    submit: string;
    required: string;
    optional: string;
    error: string;
    success: string;
    retry: string;
    close: string;
  };
  // Auth
  auth: {
    login: string;
    signup: string;
    logout: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    studioName: string;
    createAccount: string;
    alreadyHaveAccount: string;
    noAccountYet: string;
    forgotPassword: string;
    resetPassword: string;
    verifyEmail: string;
  };
  // Validation
  validation: {
    required: string;
    invalidEmail: string;
    passwordMinLength: string;
    passwordsDontMatch: string;
    invalidPhone: string;
    minLength: string;
    maxLength: string;
    invalidUrl: string;
    invalidPostalCode: string;
  };
  // Onboarding
  onboarding: {
    step1Title: string;
    step1Description: string;
    step2Title: string;
    step2Description: string;
    step3Title: string;
    step3Description: string;
    step4Title: string;
    step4Description: string;
    step5Title: string;
    step5Description: string;
    studioInfo: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    website: string;
    description: string;
    channelSetup: string;
    voiceSetup: string;
    aiPersonality: string;
    automationRules: string;
    testAndLaunch: string;
  };
  // Dashboard
  dashboard: {
    title: string;
    leads: string;
    messages: string;
    calls: string;
    analytics: string;
    settings: string;
  };
  // Errors
  errors: {
    generic: string;
    networkError: string;
    unauthorized: string;
    notFound: string;
    serverError: string;
    sessionExpired: string;
    tryAgain: string;
    contactSupport: string;
  };
}

export const translations: Record<Locale, TranslationKeys> = {
  de: {
    common: {
      loading: 'Wird geladen...',
      save: 'Speichern',
      cancel: 'Abbrechen',
      back: 'Zurück',
      continue: 'Weiter',
      submit: 'Absenden',
      required: 'Pflichtfeld',
      optional: 'Optional',
      error: 'Fehler',
      success: 'Erfolg',
      retry: 'Erneut versuchen',
      close: 'Schließen',
    },
    auth: {
      login: 'Anmelden',
      signup: 'Registrieren',
      logout: 'Abmelden',
      email: 'E-Mail',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      fullName: 'Vollständiger Name',
      studioName: 'Studio Name',
      createAccount: 'Konto erstellen',
      alreadyHaveAccount: 'Bereits registriert?',
      noAccountYet: 'Noch kein Konto?',
      forgotPassword: 'Passwort vergessen?',
      resetPassword: 'Passwort zurücksetzen',
      verifyEmail: 'E-Mail verifizieren',
    },
    validation: {
      required: 'Dieses Feld ist erforderlich',
      invalidEmail: 'Bitte gib eine gültige E-Mail-Adresse ein',
      passwordMinLength: 'Passwort muss mindestens {min} Zeichen haben',
      passwordsDontMatch: 'Passwörter stimmen nicht überein',
      invalidPhone: 'Bitte gib eine gültige Telefonnummer ein',
      minLength: 'Mindestens {min} Zeichen erforderlich',
      maxLength: 'Maximal {max} Zeichen erlaubt',
      invalidUrl: 'Bitte gib eine gültige URL ein',
      invalidPostalCode: 'Bitte gib eine gültige Postleitzahl ein',
    },
    onboarding: {
      step1Title: 'Studio Information',
      step1Description: 'Erzähl uns von deinem Fitnessstudio',
      step2Title: 'Kanäle verbinden',
      step2Description: 'Verbinde deine Kommunikationskanäle für die Automatisierung',
      step3Title: 'KI-Persönlichkeit & Stimme',
      step3Description: 'Wähle die Stimme und den Ton deines KI-Assistenten',
      step4Title: 'Lead-Regeln & Automatisierung',
      step4Description: 'Definiere, wie dein KI-Assistent Leads klassifiziert und nachfasst',
      step5Title: 'Test & Go-Live',
      step5Description: 'Überprüfe deine Konfiguration und starte die Automatisierung',
      studioInfo: 'Studio Information',
      address: 'Adresse',
      city: 'Stadt',
      postalCode: 'Postleitzahl',
      phone: 'Telefon',
      website: 'Webseite',
      description: 'Beschreibung',
      channelSetup: 'Kanal-Einrichtung',
      voiceSetup: 'Stimme einrichten',
      aiPersonality: 'KI-Persönlichkeit',
      automationRules: 'Automatisierungsregeln',
      testAndLaunch: 'Test & Start',
    },
    dashboard: {
      title: 'Dashboard',
      leads: 'Leads',
      messages: 'Nachrichten',
      calls: 'Anrufe',
      analytics: 'Analysen',
      settings: 'Einstellungen',
    },
    errors: {
      generic: 'Ein Fehler ist aufgetreten',
      networkError: 'Netzwerkfehler. Bitte überprüfe deine Internetverbindung.',
      unauthorized: 'Du bist nicht berechtigt, diese Aktion durchzuführen.',
      notFound: 'Die angeforderte Ressource wurde nicht gefunden.',
      serverError: 'Ein Serverfehler ist aufgetreten. Bitte versuche es später erneut.',
      sessionExpired: 'Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.',
      tryAgain: 'Bitte versuche es erneut.',
      contactSupport: 'Wenn das Problem weiterhin besteht, kontaktiere bitte den Support.',
    },
  },
  en: {
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      back: 'Back',
      continue: 'Continue',
      submit: 'Submit',
      required: 'Required',
      optional: 'Optional',
      error: 'Error',
      success: 'Success',
      retry: 'Retry',
      close: 'Close',
    },
    auth: {
      login: 'Log in',
      signup: 'Sign up',
      logout: 'Log out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      studioName: 'Studio Name',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      noAccountYet: 'No account yet?',
      forgotPassword: 'Forgot password?',
      resetPassword: 'Reset Password',
      verifyEmail: 'Verify Email',
    },
    validation: {
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      passwordMinLength: 'Password must be at least {min} characters',
      passwordsDontMatch: 'Passwords do not match',
      invalidPhone: 'Please enter a valid phone number',
      minLength: 'At least {min} characters required',
      maxLength: 'Maximum {max} characters allowed',
      invalidUrl: 'Please enter a valid URL',
      invalidPostalCode: 'Please enter a valid postal code',
    },
    onboarding: {
      step1Title: 'Studio Information',
      step1Description: 'Tell us about your fitness studio',
      step2Title: 'Connect Channels',
      step2Description: 'Connect your communication channels for automation',
      step3Title: 'AI Personality & Voice',
      step3Description: 'Choose the voice and tone for your AI assistant',
      step4Title: 'Lead Rules & Automation',
      step4Description: 'Define how your AI assistant classifies and follows up with leads',
      step5Title: 'Test & Go-Live',
      step5Description: 'Review your configuration and start automation',
      studioInfo: 'Studio Information',
      address: 'Address',
      city: 'City',
      postalCode: 'Postal Code',
      phone: 'Phone',
      website: 'Website',
      description: 'Description',
      channelSetup: 'Channel Setup',
      voiceSetup: 'Voice Setup',
      aiPersonality: 'AI Personality',
      automationRules: 'Automation Rules',
      testAndLaunch: 'Test & Launch',
    },
    dashboard: {
      title: 'Dashboard',
      leads: 'Leads',
      messages: 'Messages',
      calls: 'Calls',
      analytics: 'Analytics',
      settings: 'Settings',
    },
    errors: {
      generic: 'An error occurred',
      networkError: 'Network error. Please check your internet connection.',
      unauthorized: 'You are not authorized to perform this action.',
      notFound: 'The requested resource was not found.',
      serverError: 'A server error occurred. Please try again later.',
      sessionExpired: 'Your session has expired. Please log in again.',
      tryAgain: 'Please try again.',
      contactSupport: 'If the problem persists, please contact support.',
    },
  },
};

/**
 * Get the default locale based on browser settings or fallback
 */
export function getDefaultLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'de';
  }
  
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('en')) {
    return 'en';
  }
  return 'de';
}

/**
 * Replace placeholders in translation strings
 * e.g., "Password must be at least {min} characters" -> "Password must be at least 8 characters"
 */
export function interpolate(text: string, params: Record<string, string | number>): string {
  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }, text);
}
